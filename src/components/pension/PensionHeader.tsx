"use client";

export function PensionHeader() {
    return (
        <header className="space-y-2 border-b border-slate-200 pb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">年金繰上げ・繰下げシミュレーター</h1>
            <p className="text-sm text-slate-600 md:text-base">ねんきん定期便の年額を入力し、受給開始年齢を変えた場合の手取り累積を65歳開始と比較します（簡易モデル）。</p>
        </header>
    );
}
