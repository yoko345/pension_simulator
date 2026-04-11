"use client";

import { createContext, useContext, useState } from "react";
import { AGE_STANDARD, type FamilyPreset } from "@/lib/calculations";
import { defaultPensionInput } from "@/components/pension/pension-defaults";

type PensionInputContextType = {
    preset: FamilyPreset;
    setPreset: (v: FamilyPreset) => void;
    basic: number;
    setBasic: (v: number) => void;
    employee: number;
    setEmployee: (v: number) => void;
    spousePension: number;
    setSpousePension: (v: number) => void;
    spouseIncome: number;
    setSpouseIncome: (v: number) => void;
    householdSize: number;
    setHouseholdSize: (v: number) => void;
    lifeInsurance: number;
    setLifeInsurance: (v: number) => void;
    medicalExpense: number;
    setMedicalExpense: (v: number) => void;
    startAgeMonths: number;
    setStartAgeMonths: (v: number) => void;
};

const PensionInputContext = createContext<PensionInputContextType | null>(null);

export function PensionInputProvider({ children }: { children: React.ReactNode }) {
    const [preset, setPreset] = useState<FamilyPreset>("single");
    const [basic, setBasic] = useState(defaultPensionInput.pension.basic);
    const [employee, setEmployee] = useState(defaultPensionInput.pension.employee);
    const [spousePension, setSpousePension] = useState(defaultPensionInput.pension.spousePension ?? 0);
    const [spouseIncome, setSpouseIncome] = useState(defaultPensionInput.family.spouseIncome);
    const [householdSize, setHouseholdSize] = useState(defaultPensionInput.family.householdSize);
    const [lifeInsurance, setLifeInsurance] = useState(defaultPensionInput.insurance.lifeInsurance);
    const [medicalExpense, setMedicalExpense] = useState(defaultPensionInput.insurance.medicalExpense);
    const [startAgeMonths, setStartAgeMonths] = useState(AGE_STANDARD * 12);

    return (
        <PensionInputContext.Provider
            value={{
                preset,
                setPreset,
                basic,
                setBasic,
                employee,
                setEmployee,
                spousePension,
                setSpousePension,
                spouseIncome,
                setSpouseIncome,
                householdSize,
                setHouseholdSize,
                lifeInsurance,
                setLifeInsurance,
                medicalExpense,
                setMedicalExpense,
                startAgeMonths,
                setStartAgeMonths,
            }}
        >
            {children}
        </PensionInputContext.Provider>
    );
}

export function usePensionInput(): PensionInputContextType {
    const ctx = useContext(PensionInputContext);
    if (!ctx) throw new Error("usePensionInput は PensionInputProvider の内側で使用してください");
    return ctx;
}
