"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
};

export function PensionChartInner({ chartData, startAgeYears, startAgeMonths }: PensionChartInnerProps) {
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
                    domain={[AGE_START, AGE_END - 1]}
                    tick={{ fontSize: 12 }}
                    label={{ value: "年齢（歳）", position: "insideBottom", offset: -4 }}
                />
                <YAxis
                    tickFormatter={(v) => formatYenGroupedDigits(Number(v))}
                    tick={{ fontSize: 11 }}
                    width={92}
                    tickMargin={8}
                />
                <Tooltip
                    formatter={(value: number) => formatYen(value)}
                    labelFormatter={(age) => `${age}歳時点（年次サンプル）`}
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
            </LineChart>
        </ResponsiveContainer>
    );
}
