import React, { useState, useRef } from 'react';
import Skeleton from '../../../components/ui/Skeleton';

interface ActivityChartProps {
    timeline: Record<string, number> | null;
    isLoading: boolean;
    title?: string;
}

const ChartSkeleton: React.FC = () => (
    <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 flex flex-col h-full min-h-[300px] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-4">
            <Skeleton width={180} height={24} />
        </div>
        <div className="flex-1 w-full flex flex-col gap-4">
            <div className="flex-1 relative border-l border-b border-border-dark/20 flex flex-col justify-between py-4 pl-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-full border-t border-border-dark/10 h-0" />
                ))}
                <div className="absolute inset-0 flex items-end">
                    <Skeleton width="100%" height="40%" className="opacity-10" />
                </div>
            </div>
            <div className="flex justify-between px-10">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <Skeleton key={i} width={30} height={12} />
                ))}
            </div>
        </div>
    </div>
);

const ActivityChart: React.FC<ActivityChartProps> = ({ timeline, isLoading, title = "Engagement (Last 7 Days)" }) => {
    if (isLoading) return <ChartSkeleton />;

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Responsive Chart Dimensions
    // Mobile: 400x280 (High readability)
    // Desktop: 900x350 (Compact & Clean - "Like before")
    const [dimensions, setDimensions] = useState({ width: 900, height: 350 });

    React.useEffect(() => {
        const updateDimensions = () => {
            const isMobile = window.innerWidth < 640;
            setDimensions({
                width: isMobile ? 400 : 900,
                height: isMobile ? 280 : 350
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const { width, height } = dimensions;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Process data
    const getChartData = () => {
        if (!timeline || Object.keys(timeline).length === 0) return { points: [], yAxisLabels: [] };

        const sortedDates = Object.keys(timeline).sort();
        const rawValues = Object.values(timeline);
        const maxVal = Math.max(...rawValues);

        const yMax = Math.ceil((maxVal * 1.2) / 2) * 2 || 4;
        const yAxisLabels = [0, yMax / 4, yMax / 2, (yMax * 3) / 4, yMax].map(v => Math.round(v));

        const points = sortedDates.map((date, index) => {
            const d = new Date(date);
            return {
                x: margin.left + (index / Math.max(sortedDates.length - 1, 1)) * chartWidth,
                y: margin.top + (chartHeight - (timeline[date] / yMax) * chartHeight),
                clicks: timeline[date],
                dateRaw: date,
                label: `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' }).replace('.', '')}`
            };
        });

        return { points, yAxisLabels, yMax };
    };

    const { points, yAxisLabels, yMax } = getChartData();

    const onMouseMove = (e: React.MouseEvent) => {
        if (!svgRef.current || points.length === 0) return;

        const rect = svgRef.current.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * width;

        let nearestIndex = 0;
        let minDistance = Math.abs(mouseX - points[0].x);

        points.forEach((p, i) => {
            const distance = Math.abs(mouseX - p.x);
            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = i;
            }
        });

        setHoveredIndex(nearestIndex);
    };

    // Simple smooth path
    const getSmoothPath = (pts: { x: number, y: number }[]) => {
        if (pts.length < 2) return '';

        return pts.reduce((acc, point, i, a) => {
            if (i === 0) return `M ${point.x},${point.y}`;
            const prev = a[i - 1];
            const cp1x = prev.x + (point.x - prev.x) * 0.5;
            const cp1y = prev.y;
            const cp2x = point.x - (point.x - prev.x) * 0.5;
            const cp2y = point.y;
            return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
        }, '');
    };

    const pathData = points.length > 0 ? getSmoothPath(points) : '';
    const areaData = points.length > 1
        ? `${pathData} L ${points[points.length - 1].x},${margin.top + chartHeight} L ${points[0].x},${margin.top + chartHeight} Z`
        : '';

    return (
        <div className="bg-surface-dark border border-border-dark/60 rounded-2xl p-6 flex flex-col w-full overflow-hidden shadow-2xl">
            <div className="mb-4">
                <h3 className="text-white text-lg font-bold font-display">{title}</h3>
            </div>

            <div className="flex-1 w-full relative min-h-0">
                {points.length > 0 ? (
                    <div className="w-full h-full">
                        <svg
                            ref={svgRef}
                            className="w-full h-full"
                            viewBox={`0 0 ${width} ${height}`}
                            preserveAspectRatio="xMidYMid meet"
                            onMouseMove={onMouseMove}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <defs>
                                <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#ec5b13', stopOpacity: 0.3 }} />
                                    <stop offset="100%" style={{ stopColor: '#ec5b13', stopOpacity: 0.05 }} />
                                </linearGradient>
                            </defs>

                            {/* Y-Axis Grid */}
                            {yAxisLabels.map((label, i) => {
                                const yPos = margin.top + chartHeight - (label / (yMax || 1)) * chartHeight;
                                return (
                                    <g key={i}>
                                        <text
                                            x={margin.left - 10}
                                            y={yPos + 4}
                                            fill="#94a3b8"
                                            fontSize="11"
                                            textAnchor="end"
                                            className="font-mono"
                                        >
                                            {label}
                                        </text>
                                        <line
                                            x1={margin.left}
                                            x2={width - margin.right}
                                            y1={yPos}
                                            y2={yPos}
                                            stroke="#334155"
                                            strokeWidth="1"
                                            strokeDasharray="2 4"
                                            opacity="0.2"
                                        />
                                    </g>
                                );
                            })}

                            {/* Area */}
                            <path d={areaData} fill="url(#chartGradient)" />

                            {/* Line */}
                            <path
                                d={pathData}
                                fill="none"
                                stroke="#ec5b13"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Points */}
                            {points.map((p, i) => (
                                <circle
                                    key={i}
                                    cx={p.x}
                                    cy={p.y}
                                    r={hoveredIndex === i ? 6 : 4}
                                    fill={hoveredIndex === i ? "#ec5b13" : "#221610"}
                                    stroke="#ec5b13"
                                    strokeWidth="2"
                                />
                            ))}

                            {/* Tooltip */}
                            {hoveredIndex !== null && (
                                <g transform={`translate(${points[hoveredIndex].x > width - 160 ? points[hoveredIndex].x - 155 : points[hoveredIndex].x + 15}, ${points[hoveredIndex].y - 40})`}>
                                    <rect
                                        width="140"
                                        height="60"
                                        rx="8"
                                        fill="#1e293b"
                                        stroke="#ec5b13"
                                        strokeWidth="2"
                                    />
                                    <text x="12" y="25" fill="white" fontSize="14" fontWeight="700">
                                        {points[hoveredIndex].dateRaw}
                                    </text>
                                    <text x="12" y="45" fill="#ec5b13" fontSize="13">
                                        Clicks: <tspan fill="white" fontWeight="700">{points[hoveredIndex].clicks}</tspan>
                                    </text>
                                </g>
                            )}
                        </svg>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                        <span className="material-symbols-outlined text-[48px] opacity-20">insights</span>
                        <p className="text-sm font-medium opacity-60">No data available</p>
                    </div>
                )}
            </div>

            {/* X-Axis Labels */}
            {points.length > 0 && (
                <div className="flex justify-between mt-4 pt-3 border-t border-border-dark/20" style={{ paddingLeft: `${margin.left}px`, paddingRight: `${margin.right}px` }}>
                    {points.map((p, i) => (
                        <span
                            key={i}
                            className={`text-xs font-medium transition-colors ${hoveredIndex === i ? 'text-white' : 'text-slate-500'}`}
                        >
                            {p.label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActivityChart;
