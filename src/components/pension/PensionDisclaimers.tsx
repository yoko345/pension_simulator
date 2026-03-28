"use client";

export function PensionDisclaimers() {
    return (
        <section className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/80 p-6 text-sm text-slate-800">
            <h2 className="font-medium text-amber-950">補足表示（必須）</h2>
            <table className="w-full border-collapse text-left text-sm">
                <thead>
                    <tr className="border-b border-amber-200">
                        <th className="py-2 pr-4 font-medium">項目</th>
                        <th className="py-2 font-medium">内容</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    <tr className="border-b border-amber-100">
                        <td className="py-2 pr-4">健康保険モデル</td>
                        <td className="py-2">所得比例：月額支給額 × 10%。実際の東京都の保険料とは異なる簡易モデルです。</td>
                    </tr>
                    <tr className="border-b border-amber-100">
                        <td className="py-2 pr-4">介護保険</td>
                        <td className="py-2">65〜74歳は月額支給の約1.8%、75歳以上は約2.4%の簡易段階モデルです。</td>
                    </tr>
                    <tr className="border-b border-amber-100">
                        <td className="py-2 pr-4">税金モデル</td>
                        <td className="py-2">所得税は課税所得に対する簡易累進（5/10/20/23%）。住民税は所得割10%＋均等割5,000円／年、非課税は世帯人数別の簡易しきい値で判定しています。</td>
                    </tr>
                    <tr>
                        <td className="py-2 pr-4">注意</td>
                        <td className="py-2">2026年4月時点の制度を意識した参考計算です。将来の改正は反映されず、実額とずれる可能性があります。最終判断は税理士・社労士等へご相談ください。</td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
}
