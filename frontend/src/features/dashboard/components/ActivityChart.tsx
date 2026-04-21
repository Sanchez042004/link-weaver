import React, { useState, useRef, useEffect } from 'react';
import Skeleton from '../../../components/ui/Skeleton';

interface ActivityChartProps {
    timeline: Record<string, number> | null;
    isLoading: boolean;
    title?: string;
}

const ChartSkeleton: React.FC = () => (
    <div className="bg-surface border border-border-primary rounded-xl p-6 flex flex-col h-[300px] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
            <Skeleton width={180} height={24} />
        </div>
        <div className="flex-1 w-full flex flex-col gap-4">
            <div className="flex-1 relative border-b border-border-primary flex flex-col justify-between py-4 pl-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-full border-t border-border-primary h-0 opacity-20" />
                ))}
            </div>
            <div className="flex justify-between px-10">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <Skeleton key={i} width={30} height={12} />
                ))}
            </div>
        </div>
    </div>
);

const ActivityChart: React.FC<ActivityChartProps> = ({ timeline, isLoading, title = "Traffic Over Time" }) => {
    if (isLoading) return <ChartSkeleton />;

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Dynamic Chart Dimensions based on container
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const chartWidth = Math.max(0, width - margin.left - margin.right);
    const chartHeight = Math.max(0, height - margin.top - margin.bottom);

    // Process data
    const getChartData = () => {
        if (!timeline || Object.keys(timeline).length === 0) return { points: [], yAxisLabels: [] };

        const sortedDates = Object.keys(timeline).sort();
        const rawValues = Object.values(timeline);
        const maxVal = Math.max(...rawValues);

        const yMax = Math.ceil((maxVal * 1.2) / 2) * 2 || 4;
        const yAxisLabels = [0, yMax / 4, yMax / 2, (yMax * 3) / 4, yMax].map(v => Math.round(v));

        const points = sortedDates.map((date, index) => {
            const d = new Date(date + 'T00:00:00'); // Ensure local tz parsing isn't off
            return {
                x: margin.left + (index / Math.max(sortedDates.length - 1, 1)) * chartWidth,
                y: margin.top + (chartHeight - (timeline[date] / (yMax || 1)) * chartHeight),
                clicks: timeline[date],
                dateRaw: date,
                label: `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' }).replace('.', '')}`
            };
        });

        return { points, yAxisLabels, yMax };
    };

    const { points, yAxisLabels, yMax } = width > 0 ? getChartData() : { points: [], yAxisLabels: [], yMax: 4 };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!svgRef.current || points.length === 0) return;

        const rect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

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
        if (pts.length === 0) return '';
        if (pts.length === 1) return `M ${margin.left},${pts[0].y} L ${margin.left + chartWidth},${pts[0].y}`;

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
    
    // Area uses the same path but closes it down to the bottom
    let areaData = '';
    if (points.length === 1) {
        areaData = `${pathData} L ${margin.left + chartWidth},${margin.top + chartHeight} L ${margin.left},${margin.top + chartHeight} Z`;
    } else if (points.length > 1) {
        areaData = `${pathData} L ${points[points.length - 1].x},${margin.top + chartHeight} L ${points[0].x},${margin.top + chartHeight} Z`;
    }

    return (
        <div className="bg-surface border border-border-primary rounded-xl p-6 mb-8 flex flex-col w-full h-[340px]">
            <div className="flex justify-between items-center mb-6">
                <span className="text-[11px] uppercase tracking-[0.06em] text-text-muted font-semibold flex items-center">
                    {title}
                    <div className="group/tooltip relative flex items-center ml-1">
                        <span className="material-symbols-outlined text-[13px] opacity-40 cursor-help hover:opacity-100 transition-opacity">info</span>
                        <div className="absolute top-full left-[10px] mt-2 w-max max-w-[180px] py-1 px-2 bg-surface border border-border-primary text-text-primary text-[10px] rounded opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 shadow-xl pointer-events-none normal-case font-normal font-body text-center">
                            Historical trend of clicks over the selected time period
                        </div>
                    </div>
                </span>
            </div>

            <div className="flex-1 w-full relative min-h-0" ref={containerRef}>
                {points.length > 0 && width > 0 ? (
                    <div className="w-full h-full absolute inset-0 text-text-primary">
                        <svg
                            ref={svgRef}
                            className="w-full h-full overflow-visible"
                            viewBox={`0 0 ${width} ${height}`}
                            preserveAspectRatio="none"
                            onMouseMove={onMouseMove}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <defs>
                                <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" stopColor="#5e6ad2" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#5e6ad2" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Y-Axis Grid */}
                            {yAxisLabels.map((label, i) => {
                                const yPos = margin.top + chartHeight - (label / (yMax || 1)) * chartHeight;
                                return (
                                    <g key={`grid-${i}`}>
                                        <text
                                            x={margin.left - 10}
                                            y={yPos + 4}
                                            fill="#8a8a8a"
                                            fontSize="10"
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
                                            stroke="#1e1e1e"
                                            strokeWidth="1"
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
                                stroke="#5e6ad2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Points */}
                            {points.length === 1 && (
                                <circle
                                    cx={width / 2}
                                    cy={points[0].y}
                                    r={5}
                                    fill="#5e6ad2"
                                    stroke="#0a0a0a"
                                    strokeWidth="2"
                                />
                            )}
                            
                            {points.length > 1 && points.map((p, i) => (
                                <circle
                                    key={`point-${i}`}
                                    cx={p.x}
                                    cy={p.y}
                                    r={hoveredIndex === i ? 5 : 3}
                                    fill="#5e6ad2"
                                    stroke="#0a0a0a"
                                    strokeWidth={hoveredIndex === i ? 1 : 1.5}
                                    className="transition-all duration-200"
                                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                                />
                            ))}

                            {/* Tooltip */}
                            {hoveredIndex !== null && points.length > 0 && (
                                <g transform={`translate(${points[hoveredIndex].x > width - 120 ? points[hoveredIndex].x - 110 : points[hoveredIndex].x + 10}, ${Math.max(10, points[hoveredIndex].y - 30)})`}>
                                    <rect
                                        width="100"
                                        height="44"
                                        rx="4"
                                        fill="#1a1a1a"
                                        stroke="#282828"
                                        strokeWidth="1"
                                    />
                                    <text x="8" y="16" fill="#e2e2e2" fontSize="10" className="font-mono">
                                        {points[hoveredIndex].dateRaw}
                                    </text>
                                    <text x="8" y="32" fill="#8a8a8a" fontSize="10" className="font-mono">
                                        Clicks: <tspan fill="#e2e2e2">{points[hoveredIndex].clicks}</tspan>
                                    </text>
                                </g>
                            )}
                        </svg>
                    </div>
                ) : (
                    width > 0 && (
                        <div className="w-full h-full flex flex-col items-center justify-center text-text-muted gap-3 border border-border-primary border-dashed rounded-lg bg-surface-hover/20">
                            <span className="material-symbols-outlined text-[32px] opacity-20">insights</span>
                            <p className="text-xs font-medium opacity-60">No data available for this range</p>
                        </div>
                    )
                )}
            </div>

            {/* X-Axis Labels */}
            {points.length > 0 && width > 0 && (
                <div className="flex justify-between mt-4 text-[10px] text-text-muted font-mono" style={{ paddingLeft: `${margin.left}px`, paddingRight: `${margin.right}px` }}>
                    {points.length === 1 ? (
                        <span className="mx-auto text-on-background">{points[0].label}</span>
                    ) : (
                        points.map((p, i) => {
                            // On small screens, hide some labels to avoid overlap
                            const isMobile = width < 480;
                            const shouldShow = !isMobile || (i % Math.ceil(points.length / 5) === 0) || i === points.length - 1;
                            
                            return (
                                <span
                                    key={`label-${i}`}
                                    className={`transition-colors text-center -ml-4 w-8 ${hoveredIndex === i ? 'text-text-primary font-bold' : 'text-text-muted'} ${shouldShow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                >
                                    {p.label}
                                </span>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default ActivityChart;
