import React from 'react';

interface SparklineProps {
    data: number[];
    width?: number | string;
    height?: number | string;
    color?: string;
}

const Sparkline: React.FC<SparklineProps> = ({
    data,
    width = "100%",
    height = "100%",
    color = "#ec5b13"
}) => {
    // Fixed internal viewBox for consistent drawing logic
    const viewWidth = 100;
    const viewHeight = 30;

    if (!data || data.length < 2) {
        return (
            <svg width={width} height={height} viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
                <line x1="0" y1={viewHeight / 2} x2={viewWidth} y2={viewHeight / 2} stroke="#54433b" strokeWidth="2" strokeDasharray="2 2" />
            </svg>
        );
    }

    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * viewWidth,
        y: viewHeight - ((val - min) / range) * (viewHeight - 4) - 2
    }));

    const getSmoothPath = (pts: { x: number, y: number }[]) => {
        return pts.reduce((acc, pt, i, a) => {
            if (i === 0) return `M ${pt.x},${pt.y}`;
            const prev = a[i - 1];
            const cp1x = prev.x + (pt.x - prev.x) / 2;
            const cp2x = prev.x + (pt.x - prev.x) / 2;
            return `${acc} C ${cp1x},${prev.y} ${cp2x},${pt.y} ${pt.x},${pt.y}`;
        }, '');
    };

    return (
        <svg width={width} height={height} viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="overflow-visible" preserveAspectRatio="none">
            <path
                d={getSmoothPath(points)}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_4px_rgba(236,91,19,0.3)]"
            />
        </svg>
    );
};

export default Sparkline;
