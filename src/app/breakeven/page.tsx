"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { annualAt65FromInput, computeAllBreakevens, type BreakevenPoint } from "@/lib/calculations";
import { usePensionInput } from "@/lib/pension-input-context";

const BreakevenAllChart = dynamic(
    () => import("@/components/pension/BreakevenAllChart").then((m) => m.BreakevenAllChart),
    { ssr: false },
);

const BreakevenInsights = dynamic(
    () => import("@/components/pension/BreakevenInsights").then((m) => m.BreakevenInsights),
    { ssr: false },
);

export default function BreakevenPage() {
    const { preset, basic, employee, spousePension, spouseIncome, householdSize, lifeInsurance, medicalExpense } =
        usePensionInput();
    const hasSpouse = preset !== "single";

    const [data, setData] = useState<BreakevenPoint[] | null>(null);

    useEffect(() => {
        const input = {
            pension: { basic, employee, spousePension: hasSpouse ? spousePension : 0 },
            family: { hasSpouse, spouseIncome, householdSize },
            insurance: { lifeInsurance, medicalExpense },
        };
        const annual65 = annualAt65FromInput({ ...input, startAgeYears: 65 });
        const points = computeAllBreakevens(input, annual65);
        setData(points);
    }, [basic, employee, spousePension, hasSpouse, spouseIncome, householdSize, lifeInsurance, medicalExpense]);

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
            <div className="flex items-center gap-3">
                <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
                    ← シミュレーターに戻る
                </Link>
            </div>

            <div>
                <h1 className="text-xl font-semibold text-slate-800">損益分岐点 — 全受給開始年齢</h1>
                <p className="mt-1 text-sm text-slate-500">
                    受給開始年齢ごとに、累積手取りが65歳開始を上回る（または下回る）年齢を表示します。
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                {data === null ? (
                    <div className="flex h-[420px] items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
                    </div>
                ) : (
                    <BreakevenAllChart data={data} />
                )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 space-y-1">
                <p className="font-medium text-slate-600">現在の入力値</p>
                <p>基礎年金: {basic.toLocaleString()}円 / 厚生年金: {employee.toLocaleString()}円</p>
                {hasSpouse && <p>配偶者年金: {spousePension.toLocaleString()}円 / 配偶者所得: {spouseIncome.toLocaleString()}円</p>}
                <p>世帯人数: {householdSize}人</p>
            </div>

            {data !== null && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <BreakevenInsights data={data} />
                </div>
            )}
        </div>
    );
}
