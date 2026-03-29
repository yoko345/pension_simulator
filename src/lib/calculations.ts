/** 設計書「年金シミュレーター.md」に基づくクライアントサイド計算（簡易モデル） */

export type FamilyPreset = "single" | "singleEarner" | "dualIncome";

export type UserInput = {
    pension: {
        basic: number;
        employee: number;
        spousePension?: number;
    };
    family: {
        hasSpouse: boolean;
        spouseIncome: number;
        householdSize: number;
    };
    insurance: {
        lifeInsurance: number;
        medicalExpense: number;
    };
    /** 受給開始年齢（60〜75、1か月ごとに指定） */
    startAgeYears: number;
};

export type MonthlyResult = {
    ageMonth: number;
    age: number;
    gross: number;
    tax: number;
    insurance: number;
    net: number;
    cumulativeNet: number;
};

export const AGE_START = 60;
export const AGE_END = 100;
const MONTHS = (AGE_END - AGE_START) * 12;
const REF_AGE = 65;
const EARLY_RATE = 0.004;
const LATE_RATE = 0.007;

const BASIC_DEDUCTION = 480_000;
const RESIDENT_PER_CAPITA = 5_000;
const RESIDENT_INCOME_RATE = 0.1;

/** 東京都 住民税非課税の簡易判定（総所得相当 × 世帯人数） */
const NON_TAX_THRESHOLDS: Record<number, number> = {
    1: 450_000,
    2: 1_050_000,
    3: 1_350_000,
    4: 1_650_000,
    5: 1_950_000,
};

function monthsFrom60ToAgeYears(ageYears: number): number {
    return Math.round((ageYears - AGE_START) * 12);
}

/** 65歳満額を基準とした年額係数 */
export function pensionAnnualFactor(startAgeYears: number): number {
    const monthsEarly = Math.round((REF_AGE - startAgeYears) * 12);
    if (monthsEarly > 0) {
        return 1 - EARLY_RATE * monthsEarly;
    }
    if (monthsEarly < 0) {
        return 1 + LATE_RATE * -monthsEarly;
    }
    return 1;
}

/** 65歳以上向け 公的年金等控除（令和6年頃の代表的分岐・簡易） */
function publicPensionDeduction65(annualPensionIncome: number): number {
    const n = annualPensionIncome;
    if (n <= 0) return 0;
    if (n <= 1_100_000) return 1_100_000;
    if (n <= 3_300_000) return Math.floor(n * 0.25 + 275_000);
    if (n <= 4_100_000) return Math.floor(n * 0.15 + 600_000);
    if (n <= 7_700_000) return Math.floor(n * 0.05 + 1_010_000);
    return Math.floor(n * 0.05 + 1_060_000);
}

/** 所得税 簡易累進（設計書の代表例） */
function incomeTaxSimplified(taxableIncome: number): number {
    if (taxableIncome <= 0) return 0;
    let remaining = taxableIncome;
    let tax = 0;
    const bands: { limit: number; rate: number }[] = [
        { limit: 1_950_000, rate: 0.05 },
        { limit: 3_300_000, rate: 0.1 },
        { limit: 6_950_000, rate: 0.2 },
        { limit: Infinity, rate: 0.23 },
    ];
    let prev = 0;
    for (const b of bands) {
        const width = Math.min(remaining, b.limit - prev);
        if (width <= 0) break;
        tax += width * b.rate;
        remaining -= width;
        prev = b.limit;
        if (remaining <= 0) break;
    }
    return Math.floor(tax);
}

function spouseDeductionAmount(spouseIncome: number): number {
    if (spouseIncome <= 480_000) return 380_000;
    if (spouseIncome >= 1_330_000) return 0;
    const t = (1_330_000 - spouseIncome) / (1_330_000 - 480_000);
    return Math.floor(380_000 * t);
}

function nursingInsuranceRate(ageYears: number): number {
    if (ageYears < 65) return 0;
    if (ageYears < 75) return 0.018;
    return 0.024;
}

function isResidentTaxExempt(householdSize: number, pensionAnnual: number, spouseIncome: number): boolean {
    const total = pensionAnnual + spouseIncome;
    const size = Math.min(Math.max(householdSize, 1), 5);
    const th = NON_TAX_THRESHOLDS[size] ?? NON_TAX_THRESHOLDS[5];
    return total <= th;
}

export type MonthComputation = {
    gross: number;
    insurance: number;
    incomeTax: number;
    residentTax: number;
    tax: number;
    net: number;
};

function computeOneMonth(ageYears: number, monthlyGross: number, input: Pick<UserInput, "family" | "insurance">, lifeDeductionCap: number): MonthComputation {
    if (monthlyGross <= 0) {
        return {
            gross: 0,
            insurance: 0,
            incomeTax: 0,
            residentTax: 0,
            tax: 0,
            net: 0,
        };
    }

    const pensionAnnual = monthlyGross * 12;
    const health = monthlyGross * 0.1;
    const nursing = monthlyGross * nursingInsuranceRate(ageYears);
    const insuranceMonthly = health + nursing;
    const socialAnnual = insuranceMonthly * 12;

    const miscFromPension = Math.max(0, pensionAnnual - publicPensionDeduction65(pensionAnnual));

    const spouseDed = input.family.hasSpouse ? spouseDeductionAmount(input.family.spouseIncome) : 0;

    const life = Math.min(lifeDeductionCap, input.insurance.lifeInsurance);
    const medical = Math.max(0, input.insurance.medicalExpense);

    const taxable = Math.max(0, miscFromPension - BASIC_DEDUCTION - spouseDed - life - medical - socialAnnual);

    const incomeTax = incomeTaxSimplified(taxable);

    let residentTax = 0;
    if (!isResidentTaxExempt(input.family.householdSize, pensionAnnual, input.family.spouseIncome)) {
        residentTax = Math.floor(taxable * RESIDENT_INCOME_RATE) + RESIDENT_PER_CAPITA;
    }

    const taxMonthly = (incomeTax + residentTax) / 12;
    const net = monthlyGross - insuranceMonthly - taxMonthly;

    return {
        gross: monthlyGross,
        insurance: insuranceMonthly,
        incomeTax: incomeTax / 12,
        residentTax: residentTax / 12,
        tax: taxMonthly,
        net,
    };
}

function monthlyGrossForMonth(monthIndex: number, startAgeYears: number, annualAt65: number): number {
    const factor = pensionAnnualFactor(startAgeYears);
    const annual = annualAt65 * factor;
    const startMonth = monthsFrom60ToAgeYears(startAgeYears);
    if (monthIndex < startMonth) return 0;
    return annual / 12;
}

const LIFE_INSURANCE_DEDUCTION_CAP = 120_000;

export function runScenario(input: UserInput, startAgeYears: number, annualAt65: number): MonthlyResult[] {
    const results: MonthlyResult[] = [];
    let cumulative = 0;
    for (let m = 0; m < MONTHS; m++) {
        const ageYears = AGE_START + m / 12;
        const gross = monthlyGrossForMonth(m, startAgeYears, annualAt65);
        const comp = computeOneMonth(ageYears, gross, { family: input.family, insurance: input.insurance }, LIFE_INSURANCE_DEDUCTION_CAP);
        cumulative += comp.net;
        results.push({
            ageMonth: m,
            age: Math.round(ageYears * 10) / 10,
            gross: comp.gross,
            tax: comp.tax,
            insurance: comp.insurance,
            net: comp.net,
            cumulativeNet: cumulative,
        });
    }
    return results;
}

/** 損益分岐：累積手取り（スライド開始）>= 累積手取り（65歳開始）となる最初の月。見つからなければ null */
export function findBreakevenMonth(cumA: number[], cumB: number[]): number | null {
    for (let i = 0; i < cumA.length; i++) {
        if ((cumA[i] > 0 || cumB[i] > 0) && cumA[i] >= cumB[i]) {
            return i;
        }
    }
    return null;
}

export function findBreakdownMonth(cumA: number[], cumB: number[]): number | null {
    for (let i = 0; i < cumA.length; i++) {
        if ((cumA[i] > 0 || cumB[i] > 0) && cumA[i] < cumB[i]) {
            return i;
        }
    }
    return null;
}

export function annualAt65FromInput(input: UserInput): number {
    const s = input.pension.spousePension ?? 0;
    return input.pension.basic + input.pension.employee + s;
}

/** 繰上げ等で65歳到達直前（65歳開始がまだ0円のとき）の先取り累積差 */
export function earlyTakeAheadAmount(results65: MonthlyResult[], resultsSlide: MonthlyResult[]): number {
    const idx = monthsFrom60ToAgeYears(REF_AGE) - 1;
    if (idx < 0) return 0;
    return resultsSlide[idx]!.cumulativeNet - results65[idx]!.cumulativeNet;
}

export function buildChartRows(results65: MonthlyResult[], resultsSlide: MonthlyResult[]): { age: number; cumulative65: number; cumulativeSlide: number }[] {
    const rows: { age: number; cumulative65: number; cumulativeSlide: number }[] = [];
    for (let i = 0; i < results65.length; i += 12) {
        const r65 = results65[i]!;
        const rs = resultsSlide[i]!;
        rows.push({
            age: Math.floor(AGE_START + i / 12),
            cumulative65: r65.cumulativeNet,
            cumulativeSlide: rs.cumulativeNet,
        });
    }
    const last = MONTHS - 1;
    const r65l = results65[last]!;
    const rsll = resultsSlide[last]!;
    const lastAgeFloor = Math.floor(AGE_START + last / 12);
    if (rows[rows.length - 1]?.age !== lastAgeFloor) {
        rows.push({
            age: lastAgeFloor,
            cumulative65: r65l.cumulativeNet,
            cumulativeSlide: rsll.cumulativeNet,
        });
    } else {
        rows[rows.length - 1] = {
            age: lastAgeFloor,
            cumulative65: r65l.cumulativeNet,
            cumulativeSlide: rsll.cumulativeNet,
        };
    }
    return rows;
}

export function applyFamilyPreset(preset: FamilyPreset): Pick<UserInput["family"], "hasSpouse" | "spouseIncome" | "householdSize"> {
    switch (preset) {
        case "single":
            return { hasSpouse: false, spouseIncome: 0, householdSize: 1 };
        case "singleEarner":
            return { hasSpouse: true, spouseIncome: 0, householdSize: 2 };
        case "dualIncome":
            return { hasSpouse: true, spouseIncome: 2_000_000, householdSize: 2 };
        default:
            return { hasSpouse: false, spouseIncome: 0, householdSize: 1 };
    }
}
