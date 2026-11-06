const OpenAIDataSkeleton = ({ darkMode }) => {
    const cardBase = `rounded-xl border p-4 ${
        darkMode ? "border-[#272b36] bg-[#11141b]" : "border-slate-200 bg-white"
    }`;
    const shimmer = `animate-pulse rounded ${
        darkMode ? "bg-[#272b36]" : "bg-slate-200"
    }`;

    return (
        <>
            <div
                className={`mb-6 flex flex-wrap items-center gap-3 border border-x-0 z-40 px-4 py-[19px] sticky top-0 left-0 ${
                    darkMode
                        ? "border-[#272b36] bg-[#11141b]"
                        : "border-slate-200 bg-white"
                }`}
            >
                <div className={`h-6 w-24 rounded-md ${shimmer}`} />
                <div className={`h-6 w-20 rounded-md ${shimmer}`} />
                <div className={`h-6 w-40 rounded-md ${shimmer}`} />
                <div className="ml-auto flex items-center gap-2">
                    <div className={`h-4 w-4 rounded ${shimmer}`} />
                    <div className={`h-4 w-32 rounded ${shimmer}`} />
                </div>
            </div>

            <div className="px-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={cardBase}>
                            <div className={`mb-4 h-9 w-9 rounded-lg ${shimmer}`} />
                            <div className={`h-4 w-28 rounded ${shimmer}`} />
                            <div className={`mt-2 h-6 w-20 rounded ${shimmer}`} />
                        </div>
                    ))}
                </div>
                <div className={`mt-6 rounded-xl border p-4 sm:p-5 ${
                    darkMode
                        ? "border-[#272b36] bg-[#11141b]"
                        : "border-slate-200 bg-white"
                }`}>
                    <div className={`mb-1 h-4 w-32 rounded ${shimmer}`} />
                    <div className={`mb-4 h-3 w-24 rounded ${shimmer}`} />
                    <div className="flex h-[320px] items-end gap-10 px-2">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-t ${shimmer}`}
                                style={{
                                    height: `${30 + Math.random() * 60}%`,
                                    opacity: 0.6,
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="mt-6">
                    <div className="mb-3 ml-1">
                        <div className={`h-4 w-28 rounded ${shimmer}`} />
                        <div className={`mt-2 h-3 w-40 rounded ${shimmer}`} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className={cardBase}>
                                <div className="mb-3 flex items-center gap-3">
                                    <div className={`h-9 w-9 shrink-0 rounded-lg ${shimmer}`} />
                                    <div className="min-w-0 flex-1">
                                        <div className={`h-4 w-24 rounded ${shimmer}`} />
                                        <div className={`mt-1 h-3 w-32 rounded ${shimmer}`} />
                                    </div>
                                </div>
                                <div className={`h-6 w-20 rounded ${shimmer}`} />
                                <div className={`mt-1 h-3 w-16 rounded ${shimmer}`} />
                                <div className={`my-3 h-px ${darkMode ? "bg-[#272b36]" : "bg-slate-100"}`} />
                                <div className="space-y-2">
                                    {Array.from({ length: 3 }).map((_, j) => (
                                        <div key={j} className="flex items-center justify-between">
                                            <div className={`h-3 w-12 rounded ${shimmer}`} />
                                            <div className={`h-3 w-16 rounded ${shimmer}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OpenAIDataSkeleton;
