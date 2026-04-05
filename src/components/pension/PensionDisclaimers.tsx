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
                        <td className="py-2">所得税は7段階の累進課税（5〜45%）＋復興特別所得税（×1.021）。住民税は所得割10%＋均等割5,000円／年。非課税判定は「所得 ≦ 45万円＋35万円×世帯人数」で判定しています。</td>
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
                <p className="text-xs text-slate-600">保険料の計算に使う「所得」は、年金収入から公的年金控除と基礎控除（430,000円）を差し引いた金額です。差し引いた結果がマイナスになる場合は0円として扱います。</p>

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

            {/* 介護保険の詳細 */}
            <div className="space-y-4">
                <h3 className="font-medium text-amber-950">介護保険の詳細</h3>
                <p className="text-xs text-slate-600">65歳以上は所得・世帯の課税状況に応じた段階制（区・令和6〜8年度）。40〜64歳分は国民健康保険の介護分に含まれます。</p>
                <p className="text-xs text-slate-600">所得 ＝ 年金収入から公的年金控除を差し引いた金額</p>
                <table className="w-full border-collapse text-left text-xs">
                    <thead>
                        <tr className="border-b border-amber-200">
                            <th className="py-1 pr-3 font-medium">段階</th>
                            <th className="py-1 pr-3 font-medium">対象</th>
                            <th className="py-1 font-medium">年額</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        <tr className="border-b border-amber-100">
                            <td className="py-1 pr-3">第1段階</td>
                            <td className="py-1 pr-3">世帯全員非課税・所得80.9万円以下</td>
                            <td className="py-1">20,900円</td>
                        </tr>
                        <tr className="border-b border-amber-100">
                            <td className="py-1 pr-3">第2段階</td>
                            <td className="py-1 pr-3">世帯全員非課税・所得120万円以下</td>
                            <td className="py-1">31,600円</td>
                        </tr>
                        <tr className="border-b border-amber-100">
                            <td className="py-1 pr-3">第3段階</td>
                            <td className="py-1 pr-3">世帯全員非課税・所得120万円超</td>
                            <td className="py-1">50,300円</td>
                        </tr>
                        <tr className="border-b border-amber-100">
                            <td className="py-1 pr-3">第4段階</td>
                            <td className="py-1 pr-3">本人非課税・世帯に課税者あり・所得80万円以下</td>
                            <td className="py-1">62,400円</td>
                        </tr>
                        <tr className="border-b border-amber-100">
                            <td className="py-1 pr-3">第5段階（基準額）</td>
                            <td className="py-1 pr-3">本人非課税・世帯に課税者あり・所得80万円超</td>
                            <td className="py-1">73,300円</td>
                        </tr>
                        <tr className="border-b border-amber-100">
                            <td className="py-1 pr-3">第6段階</td>
                            <td className="py-1 pr-3">本人課税・所得120万円未満</td>
                            <td className="py-1">84,300円</td>
                        </tr>
                        <tr className="border-b border-amber-100">
                            <td className="py-1 pr-3">第7段階</td>
                            <td className="py-1 pr-3">本人課税・所得120〜210万円未満</td>
                            <td className="py-1">91,700円</td>
                        </tr>
                        <tr className="border-b border-amber-100">
                            <td className="py-1 pr-3">第8段階</td>
                            <td className="py-1 pr-3">本人課税・所得210〜320万円未満</td>
                            <td className="py-1">102,700円</td>
                        </tr>
                        <tr className="border-b border-amber-100">
                            <td className="py-1 pr-3">第9段階</td>
                            <td className="py-1 pr-3">本人課税・所得320〜400万円未満</td>
                            <td className="py-1">124,700円</td>
                        </tr>
                        <tr>
                            <td className="py-1 pr-3">第10段階</td>
                            <td className="py-1 pr-3">本人課税・所得400万円以上</td>
                            <td className="py-1">132,000円</td>
                        </tr>
                    </tbody>
                </table>
                <p className="text-xs text-slate-500">※ 本来20段階ある区分を簡略化しています。給与・不動産収入がある場合や世帯状況によっては実際の保険料と異なる場合があります。</p>
            </div>

            {/* 税金の詳細 */}
            <div className="space-y-4">
                <h3 className="font-medium text-amber-950">税金の詳細</h3>
                <p className="text-xs text-slate-600">
                    課税所得 ＝ 年金収入から公的年金控除・基礎控除・各種控除を差し引いた金額
                </p>

                {/* 所得税 */}
                <div>
                    <p className="mb-1 text-xs font-medium text-slate-700">所得税（累進課税）＋ 復興特別所得税（×1.021）</p>
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-amber-200">
                                <th className="py-1 pr-3 font-medium">課税所得</th>
                                <th className="py-1 pr-3 font-medium">税率</th>
                                <th className="py-1 font-medium">控除額</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            <tr className="border-b border-amber-100">
                                <td className="py-1 pr-3">195万円以下</td>
                                <td className="py-1 pr-3">5%</td>
                                <td className="py-1">0円</td>
                            </tr>
                            <tr className="border-b border-amber-100">
                                <td className="py-1 pr-3">195〜330万円以下</td>
                                <td className="py-1 pr-3">10%</td>
                                <td className="py-1">97,500円</td>
                            </tr>
                            <tr className="border-b border-amber-100">
                                <td className="py-1 pr-3">330〜695万円以下</td>
                                <td className="py-1 pr-3">20%</td>
                                <td className="py-1">427,500円</td>
                            </tr>
                            <tr className="border-b border-amber-100">
                                <td className="py-1 pr-3">695〜900万円以下</td>
                                <td className="py-1 pr-3">23%</td>
                                <td className="py-1">636,000円</td>
                            </tr>
                            <tr className="border-b border-amber-100">
                                <td className="py-1 pr-3">900〜1,800万円以下</td>
                                <td className="py-1 pr-3">33%</td>
                                <td className="py-1">1,536,000円</td>
                            </tr>
                            <tr className="border-b border-amber-100">
                                <td className="py-1 pr-3">1,800〜4,000万円以下</td>
                                <td className="py-1 pr-3">40%</td>
                                <td className="py-1">2,796,000円</td>
                            </tr>
                            <tr>
                                <td className="py-1 pr-3">4,000万円超</td>
                                <td className="py-1 pr-3">45%</td>
                                <td className="py-1">4,796,000円</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 住民税 */}
                <div>
                    <p className="mb-1 text-xs font-medium text-slate-700">住民税</p>
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-amber-200">
                                <th className="py-1 pr-3 font-medium">種別</th>
                                <th className="py-1 font-medium">金額</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            <tr className="border-b border-amber-100">
                                <td className="py-1 pr-3">所得割</td>
                                <td className="py-1">課税所得 × 10%</td>
                            </tr>
                            <tr className="border-b border-amber-100">
                                <td className="py-1 pr-3">均等割</td>
                                <td className="py-1">5,000円／年</td>
                            </tr>
                            <tr>
                                <td className="py-1 pr-3">非課税ライン</td>
                                <td className="py-1">所得 ≦ 45万円 ＋ 35万円 × 世帯人数</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
