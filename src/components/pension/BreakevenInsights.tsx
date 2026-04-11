"use client";

import { type BreakevenPoint } from "@/lib/calculations";
import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const EARLY_OFFSET = 1 / 0.004 / 12; // 250 / 12 ≈ 20.83
const LATE_OFFSET = 1 / 0.007 / 12;  // ≈ 11.9

// 理論値データ（月単位でサンプリング、65歳は null でギャップ）
const theoreticalData = Array.from({ length: 75 * 12 - 60 * 12 + 1 }, (_, i) => {
    const x = (60 * 12 + i) / 12;
    return {
        x,
        early: x < 65 ? x + EARLY_OFFSET : null,
        late: x > 65 ? x + LATE_OFFSET : null,
    };
});

const EXAMPLE_AGES = [60, 62, 64, 66, 68, 70, 75] as const;

function formatAge(v: number): string {
    const y = Math.floor(v);
    const m = Math.round((v - y) * 12);
    return m > 0 ? `${y}歳${m}か月` : `${y}歳`;
}

type Props = { data: BreakevenPoint[] };

export function BreakevenInsights({ data }: Props) {
    const findActual = (startAge: number) =>
        data.find((p) => Math.round(p.startAgeYears * 12) === startAge * 12)
            ?.breakevenAgeYears ?? null;

    return (
        <div className="space-y-8">
            {/* ヘッダー */}
            <div className="border-t border-slate-200 pt-8">
                <h2 className="text-lg font-semibold text-slate-800">参考：損益分岐点の仕組み</h2>
                <p className="mt-1 text-sm text-slate-500">
                    税率が一定の場合、損益分岐点は受給開始年齢に対して直線的に変化します。
                </p>
            </div>

            {/* 公式カード */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                        繰り上げ受給（60〜65歳）
                    </p>
                    <p className="mt-3 text-3xl font-bold text-blue-900">+21年</p>
                    <p className="text-sm font-medium text-blue-800">損益分岐 ≈ 受給開始 + 20.8年</p>
                    <div className="mt-3 space-y-1 rounded-lg bg-blue-100/60 p-3 text-xs text-blue-700">
                        <p>減額率 0.4%/月（2022年改正後）</p>
                        <p>回収に必要な月数 = 1 ÷ 0.4% = <strong>250か月</strong></p>
                        <p>250 ÷ 12 = <strong>約20.8年後</strong>に65歳開始に逆転される</p>
                    </div>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">
                        繰り下げ受給（65〜75歳）
                    </p>
                    <p className="mt-3 text-3xl font-bold text-amber-900">+12年</p>
                    <p className="text-sm font-medium text-amber-800">損益分岐 ≈ 受給開始 + 11.9年</p>
                    <div className="mt-3 space-y-1 rounded-lg bg-amber-100/60 p-3 text-xs text-amber-700">
                        <p>増額率 0.7%/月</p>
                        <p>回収に必要な月数 = 1 ÷ 0.7% = <strong>143か月</strong></p>
                        <p>143 ÷ 12 = <strong>約11.9年後</strong>に65歳開始に追いつく</p>
                    </div>
                </div>
            </div>

            {/* 理論値チャート */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="mb-1 text-sm font-medium text-slate-700">理論値の直線（税率一定を仮定）</p>
                <p className="mb-4 text-xs text-slate-500">
                    繰り上げ・繰り下げともに傾き +1 の平行な直線になる。65歳で約9年のジャンプがある。
                </p>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={theoreticalData} margin={{ top: 16, right: 24, bottom: 36, left: 16 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="x"
                                type="number"
                                domain={[60, 75]}
                                ticks={[60, 62, 64, 65, 66, 68, 70, 72, 74, 75]}
                                tickFormatter={(v) => `${v}歳`}
                                label={{ value: "受給開始年齢", position: "insideBottom", offset: -20, fontSize: 12, fill: "#64748b" }}
                            />
                            <YAxis
                                type="number"
                                domain={[75, 95]}
                                ticks={[75, 80, 85, 90, 95]}
                                tickFormatter={(v) => `${v}歳`}
                                label={{ value: "損益分岐年齢", angle: -90, position: "insideLeft", offset: -4, dx: -1, fontSize: 12, fill: "#64748b" }}
                                width={60}
                            />
                            <Tooltip
                                content={({ payload, label }) => {
                                    if (!payload?.length) return null;
                                    const p = payload[0];
                                    if (!p?.value) return null;
                                    return (
                                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                                            <p className="text-slate-500">{formatAge(label as number)}スタート</p>
                                            <p className="font-medium text-slate-800">
                                                損益分岐（理論）: {formatAge(p.value as number)}
                                            </p>
                                        </div>
                                    );
                                }}
                            />
                            <ReferenceLine
                                x={65}
                                stroke="#ef4444"
                                strokeDasharray="4 4"
                                label={{ value: "65歳 ↕約9年", position: "top", fontSize: 10, fill: "#ef4444" }}
                            />
                            <Line
                                dataKey="early"
                                stroke="#3b82f6"
                                strokeWidth={2.5}
                                dot={false}
                                connectNulls={false}
                                name="繰り上げ理論値"
                            />
                            <Line
                                dataKey="late"
                                stroke="#f59e0b"
                                strokeWidth={2.5}
                                dot={false}
                                connectNulls={false}
                                name="繰り下げ理論値"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-2 flex justify-center gap-8 text-xs text-slate-600">
                    <span className="flex items-center gap-2">
                        <span className="inline-block h-0.5 w-6 rounded bg-blue-500" />
                        繰り上げ理論値（傾き+1）
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="inline-block h-0.5 w-6 rounded bg-amber-500" />
                        繰り下げ理論値（傾き+1）
                    </span>
                </div>
            </div>

            {/* 65歳の不連続ジャンプ */}
            <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                <p className="text-sm font-semibold text-red-800">なぜ65歳で約9年ジャンプするのか？</p>
                <div className="mt-4 flex items-center justify-center gap-3">
                    <div className="rounded-xl border border-blue-200 bg-white px-5 py-4 text-center shadow-sm">
                        <p className="text-xs font-medium text-blue-600">64歳11か月スタート</p>
                        <p className="mt-1 text-3xl font-bold text-blue-800">約86歳</p>
                        <p className="mt-1 text-xs text-blue-600">受給開始の 約21年後</p>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-2">
                        <div className="text-2xl text-red-500">↕</div>
                        <div className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">約9年差</div>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-white px-5 py-4 text-center shadow-sm">
                        <p className="text-xs font-medium text-amber-600">65歳1か月スタート</p>
                        <p className="mt-1 text-3xl font-bold text-amber-800">約77歳</p>
                        <p className="mt-1 text-xs text-amber-600">受給開始の 約12年後</p>
                    </div>
                </div>
                <p className="mt-4 text-xs text-red-700">
                    繰り上げは「先に受け取った累積分を後から追い越される速さ」、繰り下げは「待機中に損した分を増額で取り戻す速さ」で計算するため、65歳でロジックが切り替わり不連続になります。
                </p>
            </div>

            {/* 理論値 vs 実測値テーブル */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="mb-1 text-sm font-medium text-slate-700">理論値 vs 実測値（手取りベース）</p>
                <p className="mb-4 text-xs text-slate-500">
                    税負担の影響で実測値が理論値からずれる場合があります。
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                                <th className="pb-2 pr-6">受給開始</th>
                                <th className="pb-2 pr-6">種別</th>
                                <th className="pb-2 pr-6">理論値（税率一定）</th>
                                <th className="pb-2">実測値（この入力値）</th>
                            </tr>
                        </thead>
                        <tbody>
                            {EXAMPLE_AGES.map((age) => {
                                const isEarly = age < 65;
                                const theoretical = isEarly ? age + EARLY_OFFSET : age + LATE_OFFSET;
                                const actual = findActual(age);
                                const diff = actual !== null ? actual - theoretical : null;
                                return (
                                    <tr key={age} className="border-b border-slate-100">
                                        <td className="py-2.5 pr-6 font-medium text-slate-800">{age}歳</td>
                                        <td className="py-2.5 pr-6">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    isEarly
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-amber-100 text-amber-700"
                                                }`}
                                            >
                                                {isEarly ? "繰り上げ" : "繰り下げ"}
                                            </span>
                                        </td>
                                        <td className="py-2.5 pr-6 tabular-nums text-slate-500">
                                            {formatAge(theoretical)}
                                        </td>
                                        <td className="py-2.5">
                                            {actual !== null ? (
                                                <span className="font-medium text-slate-800">
                                                    {formatAge(actual)}
                                                    {diff !== null && Math.abs(diff) > 0.1 && (
                                                        <span
                                                            className={`ml-2 text-xs ${diff > 0 ? "text-red-500" : "text-green-600"}`}
                                                        >
                                                            ({diff > 0 ? "+" : ""}{diff.toFixed(1)}年)
                                                        </span>
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">100歳超・非表示</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 税金の影響 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <p className="text-sm font-semibold text-slate-700">入力値によって曲線が変わる理由</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                    <div className="rounded-lg bg-white p-3 border border-slate-200">
                        <p className="font-medium text-slate-700 mb-1">税率が変わらない場合</p>
                        <p className="text-slate-500">損益分岐点は傾き+1の直線。グラフ上の点が理論値と一致する。</p>
                    </div>
                    <div className="rounded-lg bg-white p-3 border border-orange-200">
                        <p className="font-medium text-orange-700 mb-1">税率の層を跨ぐ場合</p>
                        <p className="text-slate-500">手取り増加が鈍化し、損益分岐点が理論値より遅くなる。曲線が非線形になる。</p>
                    </div>
                    <div className="rounded-lg bg-white p-3 border border-red-200">
                        <p className="font-medium text-red-700 mb-1">年金額が非常に高い場合</p>
                        <p className="text-slate-500">高い繰り下げ年齢で損益分岐が100歳を超え、ドットが消えることがある。</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
