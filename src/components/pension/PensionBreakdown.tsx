"use client";

import { formatYen } from "@/lib/format-yen";
import type { MonthlyResult } from "@/lib/calculations";

export type PensionBreakdownProps = {
    last: MonthlyResult;
};

export function PensionBreakdown({ last }: PensionBreakdownProps) {
    return (
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
    );
}
