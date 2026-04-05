export async function GET() {
    const res = await fetch(
        "https://raw.githubusercontent.com/yoko345/pension_simulator/main/public/Pension_Net_Income_Strategy.pdf",
    );

    if (!res.ok) {
        return new Response("PDF の取得に失敗しました", { status: 502 });
    }

    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline",
        },
    });
}
