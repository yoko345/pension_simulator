"use client";

import { formatYen } from "@/lib/format-yen";
import type { MonthlyResult } from "@/lib/calculations";

export type PensionBreakdownProps = {
    last: MonthlyResult;
};

export function PensionBreakdown({ last }: PensionBreakdownProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-slate-800">月額手取りの内訳（スライド開始・100歳時点）</h2>
            <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex justify-between">
                    <span>支給額（月額・グロス）</span>
                    <span className="tabular-nums text-slate-900">{formatYen(last.gross)}</span>
                </li>
                <li className="flex justify-between pl-3">
                    <span>− 税金（所得税＋住民税）</span>
                    <span className="tabular-nums text-slate-900">{formatYen(last.tax)}</span>
                </li>
                <li className="flex justify-between pl-3">
                    <span>− 社会保険料（健康保険＋介護）</span>
                    <span className="tabular-nums text-slate-900">{formatYen(last.insurance)}</span>
                </li>
                <li className="flex justify-between border-t border-slate-100 pt-2 font-medium text-slate-800">
                    <span>手取り（月額）</span>
                    <span className="tabular-nums">{formatYen(last.net)}</span>
                </li>
            </ul>
        </div>
    );
}
