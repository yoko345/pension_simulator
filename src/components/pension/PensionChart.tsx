"use client";

import dynamic from "next/dynamic";
import type { PensionChartInnerProps } from "./PensionChartInner";

const PensionChartInner = dynamic(() => import("./PensionChartInner").then((m) => m.PensionChartInner), {
    ssr: false,
    loading: () => <div className="flex h-full min-h-[20rem] items-center justify-center text-sm text-slate-500">グラフを読み込み中…</div>,
});

export function PensionChart(props: PensionChartInnerProps) {
    return <PensionChartInner {...props} />;
}
