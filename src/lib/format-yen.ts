const groupedDigitsFormatter = new Intl.NumberFormat("ja-JP", {
    useGrouping: true,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
});

/** 円の金額を、桁区切り（例: 150,000）のみで表す（縦軸など・通貨記号なし） */
export function formatYenGroupedDigits(n: number): string {
    return groupedDigitsFormatter.format(Math.round(n));
}

export function formatYen(n: number): string {
    return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
        maximumFractionDigits: 0,
    }).format(Math.round(n));
}
