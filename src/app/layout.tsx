import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "年金繰上げ・繰下げシミュレーター",
    description: "東京都の税金・社会保険を簡易モデルで織り込んだ手取りベースの比較（参考用）",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className="min-h-screen antialiased">{children}</body>
        </html>
    );
}
