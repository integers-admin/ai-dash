const ApifySkeleton = ({ darkMode }) => {
    const cardBase = `rounded-xl border p-4 ${
        darkMode ? "border-[#272b36] bg-[#11141b]" : "border-slate-200 bg-white"
    }`;
    const shimmer = `animate-pulse rounded ${
        darkMode ? "bg-[#272b36]" : "bg-slate-200"
    }`;

    const barHeights = [30, 20, 18, 22, 55, 15, 12, 80, 100, 25, 18, 14, 10];

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
                <div className={`h-6 w-28 rounded-md ${shimmer}`} />
                <div className={`h-6 w-32 rounded-md ${shimmer}`} />
                <div className={`h-6 w-40 rounded-md ${shimmer}`} />
                <div className="ml-auto flex items-center gap-2">
                    <div className={`h-4 w-4 rounded ${shimmer}`} />
                    <div className={`h-4 w-20 rounded ${shimmer}`} />
                    <div className={`h-4 w-32 rounded ${shimmer}`} />
                </div>
            </div>

            <div className="px-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={cardBase}>
                            <div className="mb-4 flex items-center gap-2.5">
                                <div
                                    className={`h-8 w-8 shrink-0 rounded-lg ${shimmer}`}
                                />
                                <div
                                    className={`h-3 w-24 rounded ${shimmer}`}
                                />
                            </div>
                            <div className={`h-6 w-20 rounded ${shimmer}`} />
                            <div
                                className={`mt-1 h-3 w-10 rounded ${shimmer}`}
                            />
                            <div
                                className={`mt-3 h-2 w-full rounded-full ${shimmer}`}
                            />
                            <div className="mt-1 flex justify-between">
                                <div
                                    className={`h-2.5 w-12 rounded ${shimmer}`}
                                />
                                <div
                                    className={`h-2.5 w-12 rounded ${shimmer}`}
                                />
                            </div>
                            <div
                                className={`my-3 h-px ${
                                    darkMode ? "bg-[#272b36]" : "bg-slate-100"
                                }`}
                            />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`h-3 w-10 rounded ${shimmer}`}
                                    />
                                    <div
                                        className={`h-3 w-14 rounded ${shimmer}`}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`h-3 w-16 rounded ${shimmer}`}
                                    />
                                    <div
                                        className={`h-3 w-14 rounded ${shimmer}`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <div className="mb-3 ml-1">
                        <div className={`h-4 w-36 rounded ${shimmer}`} />
                        <div className={`mt-2 h-3 w-40 rounded ${shimmer}`} />
                    </div>

                    <div
                        className={`rounded-xl border p-4 sm:p-6 ${
                            darkMode
                                ? "border-[#272b36] bg-[#11141b]"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <div className="flex h-[320px] items-end justify-between gap-2 px-2">
                            {barHeights.map((h, i) => (
                                <div
                                    key={i}
                                    className="flex flex-1 flex-col items-center justify-end h-full"
                                >
                                    <div
                                        className={`w-full max-w-[40px] rounded-t ${shimmer}`}
                                        style={{
                                            height: `${h}%`,
                                            opacity: 0.6,
                                        }}
                                    />
                                    <div
                                        className={`mt-3 h-2.5 w-10 rounded ${shimmer}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="mb-3 ml-1">
                        <div className={`h-4 w-40 rounded ${shimmer}`} />
                        <div className={`mt-2 h-3 w-48 rounded ${shimmer}`} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className={cardBase}>
                                <div className="mb-3 flex items-center justify-between">
                                    <div
                                        className={`h-8 w-8 rounded-lg ${shimmer}`}
                                    />
                                    <div
                                        className={`h-3 w-10 rounded ${shimmer}`}
                                    />
                                </div>
                                <div
                                    className={`h-4 w-32 rounded ${shimmer}`}
                                />
                                <div
                                    className={`mt-1 h-3 w-24 rounded ${shimmer}`}
                                />
                                <div
                                    className={`mt-3 h-5 w-20 rounded ${shimmer}`}
                                />
                                <div
                                    className={`mt-3 h-1.5 w-full rounded-full ${shimmer}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-6 mb-10">
                    <div className="mb-3 ml-1">
                        <div className={`h-4 w-24 rounded ${shimmer}`} />
                        <div className={`mt-2 h-3 w-32 rounded ${shimmer}`} />
                    </div>

                    <div
                        className={`overflow-hidden rounded-xl border ${
                            darkMode
                                ? "border-[#272b36] bg-[#11141b]"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead
                                    className={`text-xs uppercase ${
                                        darkMode
                                            ? "bg-[#0b0e14] text-[#a0a8b8]"
                                            : "bg-slate-50 text-slate-500"
                                    }`}
                                >
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            <div
                                                className={`h-3 w-20 rounded ${shimmer}`}
                                            />
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            <div
                                                className={`h-3 w-16 rounded ${shimmer}`}
                                            />
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            <div
                                                className={`h-3 w-20 rounded ${shimmer}`}
                                            />
                                        </th>
                                        <th className="px-4 py-3 font-medium text-right">
                                            <div
                                                className={`ml-auto h-3 w-14 rounded ${shimmer}`}
                                            />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    className={`divide-y ${
                                        darkMode
                                            ? "divide-[#272b36]"
                                            : "divide-slate-100"
                                    }`}
                                >
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-3">
                                                <div
                                                    className={`h-4 w-32 rounded ${shimmer}`}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div
                                                    className={`h-4 w-24 rounded ${shimmer}`}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div
                                                    className={`h-4 w-20 rounded ${shimmer}`}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div
                                                    className={`ml-auto h-6 w-16 rounded-md ${shimmer}`}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApifySkeleton;
