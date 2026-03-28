"use client";

import { PensionSimulator } from "@/components/pension/PensionSimulator";

export default function Home() {
    return (
        <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
            <PensionSimulator />
        </main>
    );
}
