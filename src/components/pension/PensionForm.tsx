"use client";

import type { FamilyPreset } from "@/lib/calculations";

export type PensionFormProps = {
    preset: FamilyPreset;
    onPreset: (p: FamilyPreset) => void;
    basic: number;
    onBasic: (n: number) => void;
    employee: number;
    onEmployee: (n: number) => void;
    spousePension: number;
    onSpousePension: (n: number) => void;
    hasSpouse: boolean;
    onHasSpouse: (v: boolean) => void;
    spouseIncome: number;
    onSpouseIncome: (n: number) => void;
    householdSize: number;
    onHouseholdSize: (n: number) => void;
    lifeInsurance: number;
    onLifeInsurance: (n: number) => void;
    medicalExpense: number;
    onMedicalExpense: (n: number) => void;
    startAgeYears: number;
    onStartAgeYears: (n: number) => void;
    slideFactorPercentLabel: string;
};

export function PensionForm({ preset, onPreset, basic, onBasic, employee, onEmployee, spousePension, onSpousePension, hasSpouse, onHasSpouse, spouseIncome, onSpouseIncome, householdSize, onHouseholdSize, lifeInsurance, onLifeInsurance, medicalExpense, onMedicalExpense, startAgeYears, onStartAgeYears, slideFactorPercentLabel }: PensionFormProps) {
    return (
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
                            onClick={() => onPreset(key)}
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
                        onChange={(e) => onBasic(Number(e.target.value) || 0)}
                    />
                </label>
                <label className="block text-sm text-slate-600">
                    厚生年金
                    <input
                        type="number"
                        min={0}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                        value={employee || ""}
                        onChange={(e) => onEmployee(Number(e.target.value) || 0)}
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
                            onChange={(e) => onSpousePension(Number(e.target.value) || 0)}
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
                        onChange={(e) => onHasSpouse(e.target.checked)}
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
                            onChange={(e) => onSpouseIncome(Number(e.target.value) || 0)}
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
                        onChange={(e) => onHouseholdSize(Math.max(1, Number(e.target.value) || 1))}
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
                        onChange={(e) => onLifeInsurance(Number(e.target.value) || 0)}
                    />
                </label>
                <label className="block text-sm text-slate-600">
                    医療費控除（控除額）
                    <input
                        type="number"
                        min={0}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                        value={medicalExpense || ""}
                        onChange={(e) => onMedicalExpense(Number(e.target.value) || 0)}
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
                    onChange={(e) => onStartAgeYears(Number(e.target.value))}
                    className="w-full accent-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500">繰上げは月あたり −0.4%、繰下げは +0.7%（65歳満額比）。係数: {slideFactorPercentLabel}</p>
            </div>
        </div>
    );
}
