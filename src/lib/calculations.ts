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
export const AGE_STANDARD = 65; // 標準受給開始年齢
const MONTHS = (AGE_END - AGE_START) * 12;
const EARLY_RATE = 0.004;
const LATE_RATE = 0.007;

const BASIC_DEDUCTION = 480_000;
const RESIDENT_PER_CAPITA = 5_000;
const RESIDENT_INCOME_RATE = 0.1;

function monthsFrom60ToAgeYears(ageYears: number): number {
    return Math.round((ageYears - AGE_START) * 12);
}

/** 65歳満額を基準とした年額係数 */
export function pensionAnnualFactor(startAgeYears: number): number {
    const monthsEarly = Math.round((AGE_STANDARD - startAgeYears) * 12);
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

/** 所得税（累進課税・設計書準拠）+ 復興特別所得税 1.021 */
function calcIncomeTax(taxableIncome: number): number {
    if (taxableIncome <= 0) return 0;
    let tax: number;
    if (taxableIncome <= 1_950_000)       tax = taxableIncome * 0.05;
    else if (taxableIncome <= 3_300_000)  tax = taxableIncome * 0.10 - 97_500;
    else if (taxableIncome <= 6_950_000)  tax = taxableIncome * 0.20 - 427_500;
    else if (taxableIncome <= 9_000_000)  tax = taxableIncome * 0.23 - 636_000;
    else if (taxableIncome <= 18_000_000) tax = taxableIncome * 0.33 - 1_536_000;
    else if (taxableIncome <= 40_000_000) tax = taxableIncome * 0.40 - 2_796_000;
    else                                  tax = taxableIncome * 0.45 - 4_796_000;
    return Math.floor(tax * 1.021); // 復興特別所得税
}

function spouseDeductionAmount(spouseIncome: number): number {
    if (spouseIncome <= 480_000) return 380_000;
    if (spouseIncome >= 1_330_000) return 0;
    const t = (1_330_000 - spouseIncome) / (1_330_000 - 480_000);
    return Math.floor(380_000 * t);
}

const NHI_BASIC_DEDUCTION = 430_000; // 国保所得計算用基礎控除

export type HealthInsuranceDetail = {
    /** 国保 or 後期高齢者医療制度 */
    type: "国保" | "後期高齢者";
    /** 年額: 基礎分（後期高齢者の場合は保険料全体） */
    base: number;
    /** 年額: 支援金分（国保のみ、後期高齢者は 0） */
    support: number;
    /** 年額: 介護分（国保40〜64歳のみ、それ以外は 0） */
    care: number;
    /** 年額合計 */
    total: number;
};

/** 健康保険料の内訳を返す（区ベース・2026年） */
export function calcHealthInsuranceDetail(ageYears: number, pensionAnnual: number, householdSize: number): HealthInsuranceDetail {
    const income = Math.max(0, pensionAnnual - publicPensionDeduction65(pensionAnnual) - NHI_BASIC_DEDUCTION);

    if (ageYears >= 75) {
        const total = Math.min(income * 0.0967 + 47_300, 800_000);
        return { type: "後期高齢者", base: total, support: 0, care: 0, total };
    }

    const base = Math.min(income * 0.0771 + 47_300 * householdSize, 660_000);
    const support = Math.min(income * 0.0269 + 16_800 * householdSize, 260_000);
    // 介護分：40〜64歳のみ（本人が対象、介護対象人数=1）
    const care = ageYears >= 40 && ageYears < AGE_STANDARD ? Math.min(income * 0.0223 + 16_600, 170_000) : 0;
    return { type: "国保", base, support, care, total: base + support + care };
}

function healthInsuranceAnnual(ageYears: number, pensionAnnual: number, householdSize: number): number {
    return calcHealthInsuranceDetail(ageYears, pensionAnnual, householdSize).total;
}

// 介護保険料テーブル（区・令和6〜8年度）
const CARE_STAGES: { level: number; fee: number }[] = [
    { level: 1, fee: 20_900 },
    { level: 2, fee: 31_600 },
    { level: 3, fee: 50_300 },
    { level: 4, fee: 62_400 },
    { level: 5, fee: 73_300 },
    { level: 6, fee: 84_300 },
    { level: 7, fee: 91_700 },
    { level: 8, fee: 102_700 },
    { level: 9, fee: 124_700 },
    { level: 10, fee: 132_000 },
];

function getCareStage(income: number, householdTaxExempt: boolean, selfTaxExempt: boolean): number {
    if (householdTaxExempt) {
        if (income <= 809_000) return 1;
        if (income <= 1_200_000) return 2;
        return 3;
    }
    if (selfTaxExempt) {
        if (income <= 800_000) return 4;
        return 5;
    }
    if (income < 1_200_000) return 6;
    if (income < 2_100_000) return 7;
    if (income < 3_200_000) return 8;
    if (income < 4_000_000) return 9;
    return 10;
}

/** 介護保険料（年額）: 65歳以上のみ。40〜64歳は国保の介護分に含む。 */
function nursingCareAnnual(ageYears: number, pensionAnnual: number, householdSize: number, spouseIncome: number): number {
    if (ageYears < AGE_STANDARD) return 0;
    // 設計書：所得 = max(0, 年金収入 - 公的年金控除)
    const income = Math.max(0, pensionAnnual - publicPensionDeduction65(pensionAnnual));
    const householdTaxExempt = isResidentTaxExempt(householdSize, pensionAnnual, spouseIncome);
    const selfTaxExempt = isResidentTaxExempt(1, pensionAnnual, 0);
    const stage = getCareStage(income, householdTaxExempt, selfTaxExempt);
    return CARE_STAGES.find((r) => r.level === stage)?.fee ?? 0;
}

/** 住民税非課税判定（設計書準拠）: 450,000 + 350,000 × 世帯人数 */
function isResidentTaxExempt(householdSize: number, pensionAnnual: number, spouseIncome: number): boolean {
    const income = Math.max(0, pensionAnnual + spouseIncome - publicPensionDeduction65(pensionAnnual));
    const threshold = 450_000 + 350_000 * Math.max(householdSize, 1);
    return income <= threshold;
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
    const annualHealth = healthInsuranceAnnual(ageYears, pensionAnnual, input.family.householdSize);
    const annualCare = nursingCareAnnual(ageYears, pensionAnnual, input.family.householdSize, input.family.spouseIncome);
    const insuranceMonthly = (annualHealth + annualCare) / 12;
    const socialAnnual = annualHealth + annualCare;

    const miscFromPension = Math.max(0, pensionAnnual - publicPensionDeduction65(pensionAnnual));

    const spouseDed = input.family.hasSpouse ? spouseDeductionAmount(input.family.spouseIncome) : 0;

    const life = Math.min(lifeDeductionCap, input.insurance.lifeInsurance);
    const medical = Math.max(0, input.insurance.medicalExpense);

    const taxable = Math.max(0, miscFromPension - BASIC_DEDUCTION - spouseDed - life - medical - socialAnnual);

    const incomeTax = calcIncomeTax(taxable);

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
    const idx = monthsFrom60ToAgeYears(AGE_STANDARD) - 1;
    if (idx < 0) return 0;
    return resultsSlide[idx]!.cumulativeNet - results65[idx]!.cumulativeNet;
}

/** 繰下げ時に65歳開始と比べてスライド受給開始直前までに受け取れなかった累積差 */
export function lateDelayForegoneAmount(
    results65: MonthlyResult[],
    resultsSlide: MonthlyResult[],
    startAgeYears: number,
): number {
    const idx = Math.round((startAgeYears - AGE_START) * 12) - 1;
    if (idx < 0 || idx >= results65.length) return 0;
    return results65[idx]!.cumulativeNet - resultsSlide[idx]!.cumulativeNet;
}

export type BreakevenPoint = {
    startAgeYears: number;
    /** null = 100歳までに逆転しない */
    breakevenAgeYears: number | null;
};

/** 全受給開始年齢（60〜75歳・月単位、計181パターン）の損益分岐点を一括算出 */
export function computeAllBreakevens(
    input: Omit<UserInput, "startAgeYears">,
    annual65: number,
): BreakevenPoint[] {
    const results65 = runScenario({ ...input, startAgeYears: AGE_STANDARD }, AGE_STANDARD, annual65);
    const cum65 = results65.map((r) => r.cumulativeNet);
    const points: BreakevenPoint[] = [];
    for (let m = AGE_START * 12; m <= 75 * 12; m++) {
        const startAgeYears = m / 12;
        const resultsSlide = runScenario({ ...input, startAgeYears }, startAgeYears, annual65);
        const cumSlide = resultsSlide.map((r) => r.cumulativeNet);
        let idx: number | null;
        if (startAgeYears === AGE_STANDARD) {
            idx = null;
        } else if (startAgeYears < AGE_STANDARD) {
            idx = findBreakdownMonth(cumSlide, cum65);
        } else {
            idx = findBreakevenMonth(cumSlide, cum65);
        }
        points.push({
            startAgeYears,
            breakevenAgeYears: idx !== null ? AGE_START + idx / 12 : null,
        });
    }
    return points;
}

export function buildChartRows(results65: MonthlyResult[], resultsSlide: MonthlyResult[]): { age: number; cumulative65: number; cumulativeSlide: number }[] {
    const rows: { age: number; cumulative65: number; cumulativeSlide: number }[] = [];
    for (let i = 0; i < results65.length; i++) {
        const r65 = results65[i]!;
        const rs = resultsSlide[i]!;
        rows.push({
            // 小数で月を表現（例: 65.0833... = 65歳1か月）
            age: AGE_START + i / 12,
            cumulative65: r65.cumulativeNet,
            cumulativeSlide: rs.cumulativeNet,
        });
    }
    // 最終行の age を AGE_END（100）に補正して軸目盛りと合わせる
    const last = MONTHS - 1;
    const r65l = results65[last]!;
    const rsll = resultsSlide[last]!;
    rows[rows.length - 1] = {
        age: AGE_END,
        cumulative65: r65l.cumulativeNet,
        cumulativeSlide: rsll.cumulativeNet,
    };
    return rows;
}

export function applyFamilyPreset(preset: FamilyPreset): Pick<UserInput["family"], "spouseIncome" | "householdSize"> {
    switch (preset) {
        case "single":
            return { spouseIncome: 0, householdSize: 1 };
        case "singleEarner":
            return { spouseIncome: 0, householdSize: 2 };
        case "dualIncome":
            return { spouseIncome: 2_000_000, householdSize: 2 };
        default:
            return { spouseIncome: 0, householdSize: 1 };
    }
}
