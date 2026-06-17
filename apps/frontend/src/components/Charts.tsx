"use client";

/**
 * Charts ligeros en SVG puro (sin dependencias externas).
 * Suficiente para series temporales y comparativas del MVP.
 */

interface LinePoint {
    label: string;
    value: number;
}

export function LineChart({ data, height = 200, color = "#2b8dee" }: { data: LinePoint[]; height?: number; color?: string }) {
    if (data.length === 0) {
        return <div className="h-48 flex items-center justify-center text-sm text-slate-400">Sin datos suficientes</div>;
    }

    const width = 600;
    const padding = { top: 16, right: 16, bottom: 28, left: 32 };
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    const max = 100; // notas en %
    const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

    const points = data.map((d, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + innerH - (d.value / max) * innerH;
        return { x, y, ...d };
    });

    const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    const area = `${path} L ${points[points.length - 1].x.toFixed(1)} ${padding.top + innerH} L ${points[0].x.toFixed(1)} ${padding.top + innerH} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            {/* Grid horizontal */}
            {[0, 25, 50, 75, 100].map((g) => {
                const y = padding.top + innerH - (g / max) * innerH;
                return (
                    <g key={g}>
                        <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth={1} />
                        <text x={padding.left - 6} y={y + 3} textAnchor="end" className="fill-slate-400 text-[9px]">{g}</text>
                    </g>
                );
            })}
            <path d={area} fill={color} opacity={0.1} />
            <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {points.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r={3.5} fill={color} />
                    {(i === 0 || i === points.length - 1 || data.length <= 8) && (
                        <text x={p.x} y={height - 8} textAnchor="middle" className="fill-slate-400 text-[9px]">{p.label}</text>
                    )}
                </g>
            ))}
        </svg>
    );
}

interface BarItem {
    label: string;
    value: number | null;
}

export function BarChart({ data }: { data: BarItem[] }) {
    if (data.length === 0) {
        return <div className="h-48 flex items-center justify-center text-sm text-slate-400">Sin datos</div>;
    }

    return (
        <div className="space-y-3">
            {data.map((d, i) => {
                const v = d.value ?? 0;
                const color = d.value === null ? "slate" : v >= 75 ? "emerald" : v >= 55 ? "yellow" : "red";
                return (
                    <div key={i} className="flex items-center gap-3">
                        <span className="w-32 shrink-0 text-sm font-medium truncate">{d.label}</span>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                            <div className={`bg-${color}-500 h-full rounded-full transition-all`} style={{ width: `${Math.min(v, 100)}%` }} />
                        </div>
                        <span className="w-12 text-right text-sm font-bold">{d.value === null ? "—" : `${v}%`}</span>
                    </div>
                );
            })}
        </div>
    );
}
