export { AGE_END, AGE_STANDARD, AGE_START } from "@/lib/calculations";
import { AGE_STANDARD, type UserInput } from "@/lib/calculations";

export const defaultPensionInput: UserInput = {
    pension: { basic: 800_000, employee: 1_200_000, spousePension: 0 },
    family: { hasSpouse: false, spouseIncome: 0, householdSize: 1 },
    insurance: { lifeInsurance: 0, medicalExpense: 0 },
    startAgeYears: AGE_STANDARD,
};
