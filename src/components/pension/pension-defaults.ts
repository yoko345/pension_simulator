import type { UserInput } from "@/lib/calculations";

export const AGE_START = 60;
export const AGE_END = 100;

export const defaultPensionInput: UserInput = {
    pension: { basic: 800_000, employee: 1_200_000, spousePension: 0 },
    family: { hasSpouse: false, spouseIncome: 0, householdSize: 1 },
    insurance: { lifeInsurance: 0, medicalExpense: 0 },
    startAgeYears: 65,
};
