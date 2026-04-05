"use client";

import { AGE_END, AGE_STANDARD, AGE_START, annualAt65FromInput, applyFamilyPreset, buildChartRows, earlyTakeAheadAmount, findBreakdownMonth, findBreakevenMonth, pensionAnnualFactor, runScenario, type FamilyPreset, type UserInput } from "@/lib/calculations";
import { useEffect, useMemo, useRef, useState } from "react";
import { PensionBreakdown } from "./PensionBreakdown";
import { PensionChart } from "./PensionChart";
import { PensionDisclaimers } from "./PensionDisclaimers";
import { PensionForm } from "./PensionForm";
import { PensionHeader } from "./PensionHeader";
import { PensionOutput } from "./PensionOutput";
import { defaultPensionInput } from "./pension-defaults";

export function PensionSimulator() {
    const [preset, setPreset] = useState<FamilyPreset>("single");
    const [basic, setBasic] = useState(defaultPensionInput.pension.basic);
    const [employee, setEmployee] = useState(defaultPensionInput.pension.employee);
    const [spousePension, setSpousePension] = useState(defaultPensionInput.pension.spousePension ?? 0);
    const hasSpouse = preset !== "single";
    const [spouseIncome, setSpouseIncome] = useState(defaultPensionInput.family.spouseIncome);
    const [householdSize, setHouseholdSize] = useState(defaultPensionInput.family.householdSize);
    const [lifeInsurance, setLifeInsurance] = useState(defaultPensionInput.insurance.lifeInsurance);
    const [medicalExpense, setMedicalExpense] = useState(defaultPensionInput.insurance.medicalExpense);
    const [startAgeMonths, setStartAgeMonths] = useState(AGE_STANDARD * 12);
    const [showBreakeven, setShowBreakeven] = useState(false);
    const breakevenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // スライダー操作中は即座に非表示、停止後 1200ms でフェードイン表示
    useEffect(() => {
        setShowBreakeven(false);
        if (breakevenTimerRef.current) clearTimeout(breakevenTimerRef.current);
        breakevenTimerRef.current = setTimeout(() => setShowBreakeven(true), 1200);
        return () => {
            if (breakevenTimerRef.current) clearTimeout(breakevenTimerRef.current);
        };
    }, [startAgeMonths]);

    const startAgeYears = startAgeMonths / 12;

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
    const results65 = useMemo(() => runScenario(input, AGE_STANDARD, annual65), [input, annual65]);
    const resultsSlide = useMemo(() => runScenario(input, startAgeYears, annual65), [input, startAgeYears, annual65]);

    const chartData = useMemo(() => buildChartRows(results65, resultsSlide), [results65, resultsSlide]);

    const cum65 = useMemo(() => results65.map((r) => r.cumulativeNet), [results65]);
    const cumSlide = useMemo(() => resultsSlide.map((r) => r.cumulativeNet), [resultsSlide]);

    const takeAhead = useMemo(() => earlyTakeAheadAmount(results65, resultsSlide), [results65, resultsSlide]);

    const last = resultsSlide[resultsSlide.length - 1]!;
    const last65 = results65[results65.length - 1]!;
    const slideFactor = pensionAnnualFactor(startAgeYears);

    const applyPreset = (p: FamilyPreset) => {
        setPreset(p);
        const f = applyFamilyPreset(p);
        setSpouseIncome(f.spouseIncome);
        setHouseholdSize(f.householdSize);
    };

    const breakevenIdx = useMemo(() => {
        if (startAgeYears === AGE_STANDARD) return null;
        if (startAgeYears < AGE_STANDARD) return findBreakdownMonth(cumSlide, cum65);
        return findBreakevenMonth(cumSlide, cum65);
    }, [startAgeYears, cumSlide, cum65]);

    const breakevenAgeYears = breakevenIdx !== null ? AGE_START + breakevenIdx / 12 : null;
    const breakevenCumulative =
        breakevenIdx !== null
            ? ((resultsSlide[breakevenIdx]?.cumulativeNet ?? 0) + (results65[breakevenIdx]?.cumulativeNet ?? 0)) / 2
            : null;

    const breakevenLabel = (() => {
        if (startAgeYears === AGE_STANDARD) {
            return `65歳開始と同条件のため、常に累積手取りは同等です。`;
        }

        const isLookingForBreakdown = startAgeYears < AGE_STANDARD;

        if (breakevenIdx === null) {
            if (isLookingForBreakdown) {
                return `シミュレーション終了時点（${AGE_END}歳）まで、常に累積手取りは65歳開始を上回っています。`;
            } else {
                return `${AGE_END}歳到達時点でも、累積手取りは65歳開始を上回りません（この条件では）`;
            }
        }

        const years = Math.floor(breakevenAgeYears!);
        const months = Math.round((breakevenAgeYears! - years) * 12);
        const ageString = `${years}歳${months > 0 ? `${months}か月` : ""}`;

        if (isLookingForBreakdown) {
            return `${ageString}の時点で、累積手取りが65歳開始を下回ります。`;
        } else {
            return `${ageString}の時点で、累積手取りが65歳開始を上回ります。`;
        }
    })();

    return (
        <div className="space-y-10">
            <PensionHeader />

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium text-slate-800">累積手取りの推移</h2>
                <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex justify-between text-sm text-slate-600">
                        <span className="font-medium text-slate-700">受給開始年齢</span>
                        <span className="tabular-nums">
                            {Math.floor(startAgeYears)}歳{startAgeMonths % 12}か月
                        </span>
                    </div>
                    <input
                        type="range"
                        min={60 * 12}
                        max={75 * 12}
                        step={1}
                        value={startAgeMonths}
                        onChange={(e) => setStartAgeMonths(Number(e.target.value))}
                        className="w-full accent-slate-900"
                    />
                    <p className="mt-1 text-xs text-slate-500">繰上げは月あたり −0.4%、繰下げは +0.7%（65歳満額比）。係数: {(slideFactor * 100).toFixed(2)}%</p>
                </div>
                <div className="h-[500px] w-full min-w-0">
                    <PensionChart
                        chartData={chartData}
                        startAgeYears={startAgeYears}
                        startAgeMonths={startAgeMonths}
                        breakevenAgeYears={breakevenAgeYears}
                        breakevenCumulative={breakevenCumulative}
                        showBreakeven={showBreakeven}
                    />
                </div>
            </section>

            <section className="grid gap-8 md:grid-cols-2">
                <PensionForm
                    preset={preset}
                    onPreset={applyPreset}
                    basic={basic}
                    onBasic={setBasic}
                    employee={employee}
                    onEmployee={setEmployee}
                    spousePension={spousePension}
                    onSpousePension={setSpousePension}
                    spouseIncome={spouseIncome}
                    onSpouseIncome={setSpouseIncome}
                    householdSize={householdSize}
                    onHouseholdSize={setHouseholdSize}
                    lifeInsurance={lifeInsurance}
                    onLifeInsurance={setLifeInsurance}
                    medicalExpense={medicalExpense}
                    onMedicalExpense={setMedicalExpense}
                />

                <div className="space-y-6">
                    <PensionOutput
                        breakevenLabel={breakevenLabel}
                        takeAhead={takeAhead}
                        startAgeYears={startAgeYears}
                        last={last}
                        last65={last65}
                    />
                    <PensionBreakdown last={last} />
                </div>
            </section>

            <PensionDisclaimers />

            <section className="space-y-3">
                <h2 className="font-medium text-slate-800">参考資料</h2>
                <iframe
                    src="https://raw.githubusercontent.com/yoko345/pension_simulator/main/public/Pension_Net_Income_Strategy.pdf"
                    className="h-[700px] w-full rounded-xl border border-slate-200"
                    title="Pension Net Income Strategy"
                />
            </section>
        </div>
    );
}
