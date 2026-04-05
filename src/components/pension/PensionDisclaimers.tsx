"use client";

export function PensionDisclaimers() {
    return (
        <section className="space-y-6 rounded-xl border border-amber-200 bg-amber-50/80 p-6 text-sm text-slate-800">
            <h2 className="font-medium text-amber-950">補足表示（必須）</h2>

            {/* 概要テーブル */}
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
                        <td className="py-2">区ベースの実務モデル（2026年）。74歳以下は国民健康保険（基礎分・支援金分・介護分）、75歳以上は後期高齢者医療制度で計算しています。軽減制度は考慮していません。</td>
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

            {/* 健康保険の詳細 */}
            <div className="space-y-4">
                <h3 className="font-medium text-amber-950">健康保険の詳細</h3>
                <p className="text-xs text-slate-600">
                    保険料の計算に使う「所得」は、年金収入から公的年金控除と基礎控除（430,000円）を差し引いた金額です。差し引いた結果がマイナスになる場合は0円として扱います。
                </p>

                {/* 国民健康保険 */}
                <div>
                    <p className="mb-1 text-xs font-medium text-slate-700">国民健康保険（74歳以下）</p>
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-amber-200">
                                <th className="py-1 pr-3 font-medium">区分</th>
                                <th className="py-1 pr-3 font-medium">所得割</th>
                                <th className="py-1 pr-3 font-medium">均等割</th>
                                <th className="py-1 font-medium">上限</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            <tr className="border-b border-amber-100">
                                <td className="py-1 pr-3">基礎分</td>
                                <td className="py-1 pr-3">7.71%</td>
                                <td className="py-1 pr-3">47,300円 × 世帯人数</td>
                                <td className="py-1">660,000円</td>
                            </tr>
                            <tr className="border-b border-amber-100">
                                <td className="py-1 pr-3">支援金分</td>
                                <td className="py-1 pr-3">2.69%</td>
                                <td className="py-1 pr-3">16,800円 × 世帯人数</td>
                                <td className="py-1">260,000円</td>
                            </tr>
                            <tr>
                                <td className="py-1 pr-3">介護分（40〜64歳）</td>
                                <td className="py-1 pr-3">2.23%</td>
                                <td className="py-1 pr-3">16,600円</td>
                                <td className="py-1">170,000円</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 後期高齢者医療制度 */}
                <div>
                    <p className="mb-1 text-xs font-medium text-slate-700">後期高齢者医療制度（75歳以上）</p>
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-amber-200">
                                <th className="py-1 pr-3 font-medium">所得割</th>
                                <th className="py-1 pr-3 font-medium">均等割</th>
                                <th className="py-1 font-medium">上限</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            <tr>
                                <td className="py-1 pr-3">9.67%</td>
                                <td className="py-1 pr-3">47,300円</td>
                                <td className="py-1">800,000円</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
