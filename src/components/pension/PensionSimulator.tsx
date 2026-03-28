"use client";

import { useMemo, useState } from "react";
import { applyFamilyPreset, buildChartRows, earlyTakeAheadAmount, findBreakevenMonth, pensionAnnualFactor, runScenario, type FamilyPreset, type UserInput, annualAt65FromInput } from "@/lib/calculations";
import { PensionBreakdown } from "./PensionBreakdown";
import { PensionChart } from "./PensionChart";
import { PensionDisclaimers } from "./PensionDisclaimers";
import { PensionForm } from "./PensionForm";
import { PensionHeader } from "./PensionHeader";
import { PensionOutput } from "./PensionOutput";
import { AGE_END, AGE_START, defaultPensionInput } from "./pension-defaults";

export function PensionSimulator() {
    const [preset, setPreset] = useState<FamilyPreset>("single");
    const [basic, setBasic] = useState(defaultPensionInput.pension.basic);
    const [employee, setEmployee] = useState(defaultPensionInput.pension.employee);
    const [spousePension, setSpousePension] = useState(defaultPensionInput.pension.spousePension ?? 0);
    const [hasSpouse, setHasSpouse] = useState(defaultPensionInput.family.hasSpouse);
    const [spouseIncome, setSpouseIncome] = useState(defaultPensionInput.family.spouseIncome);
    const [householdSize, setHouseholdSize] = useState(defaultPensionInput.family.householdSize);
    const [lifeInsurance, setLifeInsurance] = useState(defaultPensionInput.insurance.lifeInsurance);
    const [medicalExpense, setMedicalExpense] = useState(defaultPensionInput.insurance.medicalExpense);
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
            <PensionHeader />

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
                    hasSpouse={hasSpouse}
                    onHasSpouse={setHasSpouse}
                    spouseIncome={spouseIncome}
                    onSpouseIncome={setSpouseIncome}
                    householdSize={householdSize}
                    onHouseholdSize={setHouseholdSize}
                    lifeInsurance={lifeInsurance}
                    onLifeInsurance={setLifeInsurance}
                    medicalExpense={medicalExpense}
                    onMedicalExpense={setMedicalExpense}
                    startAgeYears={startAgeYears}
                    onStartAgeYears={setStartAgeYears}
                    slideFactorPercentLabel={`${(slideFactor * 100).toFixed(2)}%`}
                />

                <div className="space-y-6">
                    <PensionOutput
                        breakevenLabel={breakevenLabel}
                        takeAhead={takeAhead}
                        last={last}
                        last65={last65}
                    />
                    <PensionBreakdown last={last} />
                </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium text-slate-800">累積手取りの推移</h2>
                <div className="h-80 w-full min-w-0">
                    <PensionChart
                        chartData={chartData}
                        startAgeYears={startAgeYears}
                    />
                </div>
            </section>

            <PensionDisclaimers />
        </div>
    );
}
