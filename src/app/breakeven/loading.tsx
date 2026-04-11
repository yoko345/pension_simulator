export default function Loading() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="flex h-[420px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
            </div>
        </div>
    );
}
