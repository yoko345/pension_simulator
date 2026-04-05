"use client";

import { CartesianGrid, Legend, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatYen, formatYenGroupedDigits } from "@/lib/format-yen";
import { AGE_END, AGE_START } from "./pension-defaults";

export type ChartRow = {
    age: number;
    cumulative65: number;
    cumulativeSlide: number;
};

export type PensionChartInnerProps = {
    chartData: ChartRow[];
    startAgeYears: number;
    startAgeMonths: number;
    breakevenAgeYears: number | null;
    breakevenCumulative: number | null;
    showBreakeven: boolean;
};

type CalloutProps = {
    // recharts が ReferenceDot の label に渡す viewBox は { x: cx-r, y: cy-r, width: 2r, height: 2r }
    viewBox?: { x: number; y: number; width: number; height: number };
    text: string;
    flip: boolean;
};

/** 損益分岐点の吹き出しラベル（SVG） */
function BreakevenCallout({ viewBox, text, flip }: CalloutProps) {
    if (!viewBox) return null;
    // ドット中心座標を復元
    const cx = viewBox.x + viewBox.width / 2;
    const cy = viewBox.y + viewBox.height / 2;
    const bw = 104;
    const bh = 26;
    // 吹き出しの角（ドットと接するコーナー）をドット中心から少しずらす
    const offsetX = 8;
    const offsetY = 10;

    if (flip) {
        // 右半分：吹き出しをドットの左上に配置（底右コーナーがドット近傍）
        const cornerX = cx - offsetX;
        const cornerY = cy - offsetY;
        const bx = cornerX - bw;
        const by = cornerY - bh;
        return (
            <g style={{ animation: "breakeven-fadein 0.5s ease-out forwards" }}>
                {/* ドットから吹き出しコーナーへの三角テール */}
                <polygon points={`${cx},${cy} ${cornerX - 10},${cornerY} ${cornerX},${cornerY}`} fill="#dc2626" />
                <rect x={bx} y={by} width={bw} height={bh} rx={5} fill="#dc2626" />
                <text x={bx + bw / 2} y={by + bh / 2 + 4} textAnchor="middle" fill="white" fontSize={11} fontWeight="600" fontFamily="sans-serif">
                    {text}
                </text>
            </g>
        );
    }

    // 左半分：吹き出しをドットの右上に配置（底左コーナーがドット近傍）
    const cornerX = cx + offsetX;
    const cornerY = cy - offsetY;
    const bx = cornerX;
    const by = cornerY - bh;
    return (
        <g style={{ animation: "breakeven-fadein 0.5s ease-out forwards" }}>
            {/* ドットから吹き出しコーナーへの三角テール */}
            <polygon points={`${cx},${cy} ${cornerX},${cornerY} ${cornerX + 10},${cornerY}`} fill="#dc2626" />
            <rect x={bx} y={by} width={bw} height={bh} rx={5} fill="#dc2626" />
            <text x={bx + bw / 2} y={by + bh / 2 + 4} textAnchor="middle" fill="white" fontSize={11} fontWeight="600" fontFamily="sans-serif">
                {text}
            </text>
        </g>
    );
}

export function PensionChartInner({ chartData, startAgeYears, startAgeMonths, breakevenAgeYears, breakevenCumulative, showBreakeven }: PensionChartInnerProps) {
    const breakevenText = (() => {
        if (breakevenAgeYears === null) return null;
        const years = Math.floor(breakevenAgeYears);
        const months = Math.round((breakevenAgeYears - years) * 12);
        return `${years}歳${months > 0 ? `${months}か月` : ""}`;
    })();

    const midAge = (AGE_START + AGE_END) / 2;
    const flip = breakevenAgeYears !== null && breakevenAgeYears > midAge;

    return (
        <ResponsiveContainer
            width="100%"
            height="100%"
        >
            <LineChart
                data={chartData}
                margin={{ top: 12, right: 12, left: 12, bottom: 28 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                />
                <XAxis
                    dataKey="age"
                    type="number"
                    domain={[AGE_START, AGE_END]}
                    tick={{ fontSize: 12 }}
                    label={{ value: "年齢（歳）", position: "insideBottom", offset: -4 }}
                />
                <YAxis
                    tickFormatter={(v) => formatYenGroupedDigits(Number(v))}
                    tick={{ fontSize: 11 }}
                    width={92}
                    tickMargin={8}
                    domain={[0, 80_000_000]}
                />
                <Tooltip
                    formatter={(value: number) => formatYen(value)}
                    labelFormatter={(age: number) => {
                        const years = Math.floor(age);
                        const months = Math.round((age - years) * 12);
                        return months > 0 ? `${years}歳${months}か月時点` : `${years}歳時点`;
                    }}
                />
                <Legend wrapperStyle={{ paddingTop: 20 }} />
                <Line
                    type="monotone"
                    dataKey="cumulative65"
                    name="65歳開始"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={false}
                />
                <Line
                    type="monotone"
                    dataKey="cumulativeSlide"
                    name={`${Math.floor(startAgeYears)}歳${startAgeMonths % 12}か月開始`}
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                />
                {showBreakeven && breakevenAgeYears !== null && breakevenCumulative !== null && breakevenText !== null && (
                    <ReferenceDot
                        x={breakevenAgeYears}
                        y={breakevenCumulative}
                        r={5}
                        fill="#dc2626"
                        stroke="white"
                        strokeWidth={2}
                        isFront={true}
                        label={<BreakevenCallout text={breakevenText} flip={flip} />}
                    />
                )}
            </LineChart>
        </ResponsiveContainer>
    );
}
