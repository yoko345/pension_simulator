"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatYen } from "@/lib/format-yen";
import { AGE_END, AGE_START } from "./pension-defaults";

export type ChartRow = {
    age: number;
    cumulative65: number;
    cumulativeSlide: number;
};

export type PensionChartInnerProps = {
    chartData: ChartRow[];
    startAgeYears: number;
};

export function PensionChartInner({ chartData, startAgeYears }: PensionChartInnerProps) {
    return (
        <ResponsiveContainer
            width="100%"
            height="100%"
        >
            <LineChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                />
                <XAxis
                    dataKey="age"
                    type="number"
                    domain={[AGE_START, AGE_END - 1]}
                    tick={{ fontSize: 12 }}
                    label={{ value: "年齢（歳）", position: "insideBottom", offset: -4 }}
                />
                <YAxis
                    tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`}
                    tick={{ fontSize: 12 }}
                    width={48}
                />
                <Tooltip
                    formatter={(value: number) => formatYen(value)}
                    labelFormatter={(age) => `${age}歳時点（年次サンプル）`}
                />
                <Legend />
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
                    name={`${startAgeYears}歳開始`}
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
