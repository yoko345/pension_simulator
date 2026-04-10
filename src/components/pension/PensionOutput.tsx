"use client";

import { formatYen } from "@/lib/format-yen";
import { AGE_STANDARD, type MonthlyResult } from "@/lib/calculations";
import { AGE_END } from "./pension-defaults";

export type PensionOutputProps = {
    breakevenLabel: string;
    takeAhead: number;
    lateDelay: number;
    startAgeYears: number;
    last: MonthlyResult;
    last65: MonthlyResult;
};

export function PensionOutput({ breakevenLabel, takeAhead, lateDelay, startAgeYears, last, last65 }: PensionOutputProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-slate-800">出力</h2>
            <dl className="grid gap-3 text-sm">
                <div className="border-b border-slate-100 py-2">
                    <dt className="text-slate-600">損益分岐（完全逆転）</dt>
                    <dd className="mt-1 font-medium text-slate-900">{breakevenLabel}</dd>
                </div>
                {startAgeYears < AGE_STANDARD && (
                    <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
                        <dt className="text-slate-600">繰上げ時の先取り累積差（65歳直前）</dt>
                        <dd className="text-right tabular-nums text-slate-900">{formatYen(takeAhead)}</dd>
                    </div>
                )}
                {startAgeYears > AGE_STANDARD && (
                    <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
                        <dt className="text-slate-600">65歳受給開始との累積差（受給開始直前）</dt>
                        <dd className="text-right tabular-nums text-slate-900">{formatYen(lateDelay)}</dd>
                    </div>
                )}
                <div className="border-b border-slate-100 py-2">
                    <dt className="text-slate-600">月額手取り（100歳時点）</dt>
                    <div className="mt-1 space-y-1">
                        <div className="flex justify-between gap-4">
                            <span className="pl-3 text-xs text-slate-500">65歳開始</span>
                            <dd className="text-right tabular-nums text-slate-900">{formatYen(last65.net)}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="pl-3 text-xs text-slate-500">スライド開始</span>
                            <dd className="text-right tabular-nums text-slate-900">{formatYen(last.net)}</dd>
                        </div>
                    </div>
                </div>
                <div className="py-2">
                    <dt className="text-slate-600">累積手取り（{AGE_END}歳手前）</dt>
                    <div className="mt-1 space-y-1">
                        <div className="flex justify-between gap-4">
                            <span className="pl-3 text-xs text-slate-500">65歳開始</span>
                            <dd className="text-right tabular-nums text-slate-900">{formatYen(last65.cumulativeNet)}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="pl-3 text-xs text-slate-500">スライド開始</span>
                            <dd className="text-right tabular-nums text-slate-900">{formatYen(last.cumulativeNet)}</dd>
                        </div>
                    </div>
                </div>
            </dl>
        </div>
    );
}
