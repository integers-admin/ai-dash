const ApolloSkeleton = ({ darkMode }) => {
    const pulseBg = darkMode ? "bg-[#272b36]" : "bg-slate-200";
    const cardBg = darkMode ? "bg-[#11141b]" : "bg-white";
    const borderColor = darkMode ? "border-[#272b36]" : "border-slate-200";

    return (
        <>
         <div
                className={`mb-6 flex flex-wrap items-center gap-3 border border-x-0 z-40 px-4 py-[19px] transition-colors duration-500 sticky top-0 left-0 ${
                    darkMode
                        ? "border-[#272b36] bg-[#11141b]"
                        : "border-slate-200 bg-white"
                }`}
            >
                <div className={`h-6 w-24 animate-pulse rounded-md ${pulseBg}`} />
                <div className={`h-5 w-20 animate-pulse rounded-md ${pulseBg}`} />
                <div className={`h-6 w-36 animate-pulse rounded-md ${pulseBg}`} />
                <div className="ml-auto flex items-center gap-2">
                    <div className={`h-3.5 w-3.5 animate-pulse rounded-full ${pulseBg}`} />
                    <div className={`h-4 w-16 animate-pulse rounded ${pulseBg}`} />
                    <div className={`h-4 w-32 animate-pulse rounded ${pulseBg}`} />
                </div>
            </div>
        
        
        <div className="animate-pulse px-4">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`rounded-xl border p-4 ${borderColor} ${cardBg}`}>
                        <div className={`mb-4 h-9 w-9 rounded-lg ${pulseBg}`} />
                        <div className={`mb-2 h-4 w-24 rounded-md ${pulseBg}`} />
                        <div className={`mb-1 h-7 w-32 rounded-md ${pulseBg}`} />
                        <div className={`h-3 w-20 rounded-md ${pulseBg}`} />
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <div className={`mb-4 h-6 w-32 rounded-md ${pulseBg}`} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className={`rounded-xl border p-4 ${borderColor} ${cardBg}`}>
                            <div className="mb-3 flex items-center gap-3">
                                <div className={`h-9 w-9 rounded-lg ${pulseBg}`} />
                                <div className={`h-4 w-24 rounded-md ${pulseBg}`} />
                            </div>
                            <div className={`mb-2 h-6 w-28 rounded-md ${pulseBg}`} />
                            <div className={`mb-2 h-2 w-full rounded-full ${pulseBg}`} />
                            <div className={`h-3 w-16 rounded-md ${pulseBg}`} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-8">
                <div className={`mb-4 h-6 w-32 rounded-md ${pulseBg}`} />
                <div className={`rounded-xl border p-4 ${borderColor} ${cardBg}`}>
                    <div className={`mb-4 h-6 w-full rounded-md ${pulseBg}`} />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`mb-3 h-8 w-full rounded-md ${pulseBg}`} />
                    ))}
                </div>
            </div>
        </div>
        </>
    );
};

export default ApolloSkeleton;
