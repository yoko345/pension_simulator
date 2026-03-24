"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { applyFamilyPreset, buildChartRows, earlyTakeAheadAmount, findBreakevenMonth, pensionAnnualFactor, runScenario, type FamilyPreset, type UserInput, annualAt65FromInput } from "@/lib/calculations";

const AGE_START = 60;
const AGE_END = 100;

function formatYen(n: number): string {
    return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
        maximumFractionDigits: 0,
    }).format(Math.round(n));
}

const defaultInput: UserInput = {
    pension: { basic: 800_000, employee: 1_200_000, spousePension: 0 },
    family: { hasSpouse: false, spouseIncome: 0, householdSize: 1 },
    insurance: { lifeInsurance: 0, medicalExpense: 0 },
    startAgeYears: 65,
};

export function PensionSimulator() {
    const [preset, setPreset] = useState<FamilyPreset>("single");
    const [basic, setBasic] = useState(defaultInput.pension.basic);
    const [employee, setEmployee] = useState(defaultInput.pension.employee);
    const [spousePension, setSpousePension] = useState(defaultInput.pension.spousePension ?? 0);
    const [hasSpouse, setHasSpouse] = useState(defaultInput.family.hasSpouse);
    const [spouseIncome, setSpouseIncome] = useState(defaultInput.family.spouseIncome);
    const [householdSize, setHouseholdSize] = useState(defaultInput.family.householdSize);
    const [lifeInsurance, setLifeInsurance] = useState(defaultInput.insurance.lifeInsurance);
    const [medicalExpense, setMedicalExpense] = useState(defaultInput.insurance.medicalExpense);
    const [startAgeYears, setStartAgeYears] = useState(65);

    const input: UserInput = useMemo(
        () => ({
            pension: {
                basic,
                employee,
                spousePension: hasSpouse ? spousePension : 0,
            },
            family: { hasSpouse, spouseIncome, householdSize },
            insurance: { lifeInsurance, medicalExpense },
            startAgeYears,
        }),
        [basic, employee, spousePension, hasSpouse, spouseIncome, householdSize, lifeInsurance, medicalExpense, startAgeYears],
    );

    const annual65 = useMemo(() => annualAt65FromInput(input), [input]);
    const results65 = useMemo(() => runScenario(input, 65, annual65), [input, annual65]);
    const resultsSlide = useMemo(() => runScenario(input, startAgeYears, annual65), [input, startAgeYears, annual65]);

    const chartData = useMemo(() => buildChartRows(results65, resultsSlide), [results65, resultsSlide]);

    const cum65 = useMemo(() => results65.map((r) => r.cumulativeNet), [results65]);
    const cumSlide = useMemo(() => resultsSlide.map((r) => r.cumulativeNet), [resultsSlide]);

    const breakevenIdx = useMemo(() => findBreakevenMonth(cumSlide, cum65), [cumSlide, cum65]);

    const takeAhead = useMemo(() => earlyTakeAheadAmount(results65, resultsSlide), [results65, resultsSlide]);

    const last = resultsSlide[resultsSlide.length - 1]!;
    const last65 = results65[results65.length - 1]!;
    const slideFactor = pensionAnnualFactor(startAgeYears);

    const applyPreset = (p: FamilyPreset) => {
        setPreset(p);
        const f = applyFamilyPreset(p);
        setHasSpouse(f.hasSpouse);
        setSpouseIncome(f.spouseIncome);
        setHouseholdSize(f.householdSize);
    };

    const breakevenLabel =
        breakevenIdx === null
            ? `${AGE_END}歳到達時点でも、累積手取りは65歳開始を上回りません（この条件では）`
            : (() => {
                  const ageDec = AGE_START + breakevenIdx / 12;
                  const years = Math.floor(ageDec);
                  const months = Math.round((ageDec - years) * 12);
                  return `${years}歳${months > 0 ? `${months}か月` : ""}（シミュレーション開始から約${breakevenIdx + 1}か月目）`;
              })();

    return (
        <div className="space-y-10">
            <header className="space-y-2 border-b border-slate-200 pb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">年金繰上げ・繰下げシミュレーター</h1>
                <p className="text-sm text-slate-600 md:text-base">ねんきん定期便の年額を入力し、受給開始年齢を変えた場合の手取り累積を65歳開始と比較します（簡易モデル）。</p>
            </header>

            <section className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-medium text-slate-800">入力</h2>

                    <div>
                        <p className="mb-2 text-sm font-medium text-slate-700">世帯タイプ</p>
                        <div className="flex flex-wrap gap-2">
                            {(
                                [
                                    ["single", "独身"],
                                    ["singleEarner", "夫婦（片働き）"],
                                    ["dualIncome", "夫婦（共働き）"],
                                ] as const
                            ).map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => applyPreset(key)}
                                    className={`rounded-lg px-3 py-1.5 text-sm transition ${preset === key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-700">年金（年額・円）</p>
                        <label className="block text-sm text-slate-600">
                            基礎年金
                            <input
                                type="number"
                                min={0}
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                value={basic || ""}
                                onChange={(e) => setBasic(Number(e.target.value) || 0)}
                            />
                        </label>
                        <label className="block text-sm text-slate-600">
                            厚生年金
                            <input
                                type="number"
                                min={0}
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                value={employee || ""}
                                onChange={(e) => setEmployee(Number(e.target.value) || 0)}
                            />
                        </label>
                        {hasSpouse && (
                            <label className="block text-sm text-slate-600">
                                配偶者年金（任意）
                                <input
                                    type="number"
                                    min={0}
                                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                    value={spousePension || ""}
                                    onChange={(e) => setSpousePension(Number(e.target.value) || 0)}
                                />
                            </label>
                        )}
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-700">世帯情報</p>
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                checked={hasSpouse}
                                onChange={(e) => setHasSpouse(e.target.checked)}
                            />
                            配偶者あり
                        </label>
                        {hasSpouse && (
                            <label className="block text-sm text-slate-600">
                                配偶者所得（年額・円）
                                <input
                                    type="number"
                                    min={0}
                                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                    value={spouseIncome || ""}
                                    onChange={(e) => setSpouseIncome(Number(e.target.value) || 0)}
                                />
                            </label>
                        )}
                        <label className="block text-sm text-slate-600">
                            世帯人数
                            <input
                                type="number"
                                min={1}
                                max={10}
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                value={householdSize}
                                onChange={(e) => setHouseholdSize(Math.max(1, Number(e.target.value) || 1))}
                            />
                        </label>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-700">その他控除（年額・円）</p>
                        <label className="block text-sm text-slate-600">
                            生命保険料控除（申告額）
                            <input
                                type="number"
                                min={0}
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                value={lifeInsurance || ""}
                                onChange={(e) => setLifeInsurance(Number(e.target.value) || 0)}
                            />
                        </label>
                        <label className="block text-sm text-slate-600">
                            医療費控除（控除額）
                            <input
                                type="number"
                                min={0}
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                value={medicalExpense || ""}
                                onChange={(e) => setMedicalExpense(Number(e.target.value) || 0)}
                            />
                        </label>
                    </div>

                    <div>
                        <div className="mb-2 flex justify-between text-sm text-slate-600">
                            <span className="font-medium text-slate-700">受給開始年齢</span>
                            <span className="tabular-nums">{startAgeYears}歳</span>
                        </div>
                        <input
                            type="range"
                            min={60}
                            max={75}
                            step={1}
                            value={startAgeYears}
                            onChange={(e) => setStartAgeYears(Number(e.target.value))}
                            className="w-full accent-slate-900"
                        />
                        <p className="mt-1 text-xs text-slate-500">繰上げは月あたり −0.4%、繰下げは +0.7%（65歳満額比）。係数: {(slideFactor * 100).toFixed(2)}%</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-medium text-slate-800">出力</h2>
                        <dl className="grid gap-3 text-sm">
                            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
                                <dt className="text-slate-600">損益分岐（完全逆転）</dt>
                                <dd className="text-right font-medium text-slate-900">{breakevenLabel}</dd>
                            </div>
                            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
                                <dt className="text-slate-600">繰上げ時の先取り累積差（65歳直前）</dt>
                                <dd className="text-right tabular-nums text-slate-900">{formatYen(takeAhead)}</dd>
                            </div>
                            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
                                <dt className="text-slate-600">最終月の手取り（スライド開始）</dt>
                                <dd className="text-right tabular-nums text-slate-900">{formatYen(last.net)}</dd>
                            </div>
                            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
                                <dt className="text-slate-600">最終月の手取り（65歳開始）</dt>
                                <dd className="text-right tabular-nums text-slate-900">{formatYen(last65.net)}</dd>
                            </div>
                            <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
                                <dt className="text-slate-600">累積手取り（スライド・{AGE_END}歳手前）</dt>
                                <dd className="text-right tabular-nums text-slate-900">{formatYen(last.cumulativeNet)}</dd>
                            </div>
                            <div className="flex justify-between gap-4 py-2">
                                <dt className="text-slate-600">累積手取り（65歳開始）</dt>
                                <dd className="text-right tabular-nums text-slate-900">{formatYen(last65.cumulativeNet)}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-3 text-sm font-medium text-slate-800">内訳（最終月・スライド開始）</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex justify-between">
                                <span>税金（所得税＋住民税の合算・月額）</span>
                                <span className="tabular-nums text-slate-900">{formatYen(last.tax)}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>社会保険料（健康保険＋介護・簡易・月額）</span>
                                <span className="tabular-nums text-slate-900">{formatYen(last.insurance)}</span>
                            </li>
                            <li className="flex justify-between border-t border-slate-100 pt-2">
                                <span>支給額（月額・グロス）</span>
                                <span className="tabular-nums text-slate-900">{formatYen(last.gross)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium text-slate-800">累積手取りの推移</h2>
                <div className="h-80 w-full min-w-0">
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
                </div>
            </section>

            <section className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/80 p-6 text-sm text-slate-800">
                <h2 className="font-medium text-amber-950">補足表示（必須）</h2>
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-amber-200">
                            <th className="py-2 pr-4 font-medium">項目</th>
                            <th className="py-2 font-medium">内容</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        <tr className="border-b border-amber-100">
                            <td className="py-2 pr-4">健康保険モデル</td>
                            <td className="py-2">所得比例：月額支給額 × 10%。実際の東京都の保険料とは異なる簡易モデルです。</td>
                        </tr>
                        <tr className="border-b border-amber-100">
                            <td className="py-2 pr-4">介護保険</td>
                            <td className="py-2">65〜74歳は月額支給の約1.8%、75歳以上は約2.4%の簡易段階モデルです。</td>
                        </tr>
                        <tr className="border-b border-amber-100">
                            <td className="py-2 pr-4">税金モデル</td>
                            <td className="py-2">所得税は課税所得に対する簡易累進（5/10/20/23%）。住民税は所得割10%＋均等割5,000円／年、非課税は世帯人数別の簡易しきい値で判定しています。</td>
                        </tr>
                        <tr>
                            <td className="py-2 pr-4">注意</td>
                            <td className="py-2">2026年4月時点の制度を意識した参考計算です。将来の改正は反映されず、実額とずれる可能性があります。最終判断は税理士・社労士等へご相談ください。</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}
