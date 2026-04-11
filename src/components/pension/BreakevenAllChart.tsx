"use client";

import { type BreakevenPoint } from "@/lib/calculations";
import {
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Props = {
    data: BreakevenPoint[];
};

function formatAge(ageYears: number): string {
    const years = Math.floor(ageYears);
    const months = Math.round((ageYears - years) * 12);
    return months > 0 ? `${years}歳${months}か月` : `${years}歳`;
}

export function BreakevenAllChart({ data }: Props) {
    const plotData = data
        .filter((p) => p.breakevenAgeYears !== null)
        .map((p) => ({ x: p.startAgeYears, y: p.breakevenAgeYears as number }));

    const hiddenCount = data.filter((p) => p.breakevenAgeYears === null).length;

    return (
        <div className="space-y-3">
            <div className="h-[420px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 16, right: 24, bottom: 36, left: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            domain={[60, 75]}
                            ticks={[60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75]}
                            tickFormatter={(v) => `${v}歳`}
                            label={{ value: "受給開始年齢", position: "insideBottom", offset: -15, fontSize: 12, fill: "#64748b" }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            domain={[75, 95]}
                            ticks={[75, 80, 85, 90, 95]}
                            tickFormatter={(v) => `${v}歳`}
                            label={{ value: "損益分岐年齢", angle: -90, position: "insideLeft", offset: -4, dx: -1, fontSize: 12, fill: "#64748b" }}
                            width={60}
                        />
                        <Tooltip
                            content={({ payload }) => {
                                if (!payload?.length) return null;
                                const d = payload[0]?.payload as { x: number; y: number } | undefined;
                                if (!d) return null;
                                return (
                                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                                        <p className="text-slate-600">受給開始: {formatAge(d.x)}</p>
                                        <p className="font-medium text-slate-900">損益分岐: {formatAge(d.y)}</p>
                                    </div>
                                );
                            }}
                        />
                        {/* 65歳受給開始の基準線 */}
                        <ReferenceLine x={65} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: "65歳", position: "top", fontSize: 11, fill: "#94a3b8" }} />
                        <Scatter
                            data={plotData}
                            shape={(props: { cx?: number; cy?: number }) => (
                                <circle cx={props.cx} cy={props.cy} r={2} fill="#1e40af" opacity={0.8} />
                            )}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            {hiddenCount > 0 && (
                <p className="text-xs text-slate-500">
                    ※ {hiddenCount}パターンは100歳までに損益分岐点に到達しないため非表示です。
                </p>
            )}
        </div>
    );
}
