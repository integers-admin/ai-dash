import axios from "axios";
import {
    Wallet,
    ChartNoAxesCombined,
    Zap,
    ArrowDownToLine,
    ArrowUpFromLine,
    RefreshCw,
    BrainCircuit,
    Bot,
    CircleHelp,
    CalendarDays,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import PerplexityDataSkeleton from "./PerplexityDataSkeleton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PerplexityData = ({ darkMode }) => {
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(true);

    let backend_url = import.meta.env.VITE_BACKEND_URL;

    const formatNumber = (n) =>
        n == null || n === "" || !Number.isFinite(Number(n))
            ? ""
            : Number(n).toLocaleString("en-IN");

    const formatUSD = (n) => `$${n?.toFixed(2)}`;
    const formatUSD4 = (n) => `$${n?.toFixed(4)}`;
    const formatDate = (iso) =>
        new Date(iso).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const formatShortDate = (iso) =>
        new Date(iso).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const isLowBalance = value?.remainingBalanceUSD < 5;

    const kpis = [
        {
            label: "Remaining Balance",
            value: formatUSD(value?.remainingBalanceUSD),
            icon: Wallet,
            iconBg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50",
            iconColor: darkMode ? "text-emerald-400" : "text-emerald-600",
            badge: isLowBalance ? "Low Balance" : "Healthy",
            warning: isLowBalance,
        },
        {
            label: "Total Cost",
            value: formatUSD(value?.summary?.totalCostUSD),
            icon: ChartNoAxesCombined,
            iconBg: darkMode ? "bg-violet-500/10" : "bg-violet-50",
            iconColor: darkMode ? "text-violet-400" : "text-violet-600",
        },
        {
            label: "API Requests",
            value: formatNumber(value?.summary?.totalApiRequests),
            icon: Zap,
            iconBg: darkMode ? "bg-amber-500/10" : "bg-amber-50",
            iconColor: darkMode ? "text-amber-400" : "text-amber-600",
        },
        {
            label: "Input Tokens",
            value: formatNumber(value?.summary?.totalInputTokens),
            icon: ArrowDownToLine,
            iconBg: darkMode ? "bg-sky-500/10" : "bg-sky-50",
            iconColor: darkMode ? "text-sky-400" : "text-sky-600",
        },
        {
            label: "Output Tokens",
            value: formatNumber(value?.summary?.totalOutputTokens),
            icon: ArrowUpFromLine,
            iconBg: darkMode ? "bg-rose-500/10" : "bg-rose-50",
            iconColor: darkMode ? "text-rose-400" : "text-rose-600",
        },
    ];

    const chartData = value?.dailyCosts?.map((d) => ({
        date: formatShortDate(d.date),
        cost: d.costUSD,
    }));

    const modelCards = [
        {
            name: "Sonar",
            key: "sonar",
            icon: BrainCircuit,
            iconBg: darkMode ? "bg-indigo-500/10" : "bg-indigo-50",
            iconColor: darkMode ? "text-indigo-400" : "text-indigo-600",
        },
        {
            name: "GPT-5.6 Luna",
            key: "openai/gpt-5.6-luna",
            icon: Bot,
            iconBg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50",
            iconColor: darkMode ? "text-emerald-400" : "text-emerald-600",
        },
        {
            name: "Other",
            key: "other",
            icon: CircleHelp,
            iconBg: darkMode ? "bg-slate-500/10" : "bg-slate-100",
            iconColor: darkMode ? "text-slate-400" : "text-slate-600",
        },
    ];

    const perplexityData = async () => {
        try {
            setLoading(true);
            let response = await axios.get(
                `${backend_url}/api/perplexity/usage`,
            );

            if (response?.status === 200) {
                setValue(response?.data);

                // console.log("perplexity data: ",response.data);
            }
        } catch (err) {
            console.log("something went wrong", err);
            toast.error("something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        perplexityData();
    }, []);

    // console.log("value: ", value);

    if (loading) {
        return <PerplexityDataSkeleton darkMode={darkMode} />;
    }

    if (!value) {
        return (
            <div className="flex h-full items-center justify-center p-6 text-center">
                <p
                    className={`text-lg ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                >
                    Failed to load data.
                </p>
            </div>
        );
    }

    return (
        <>
            <div
                className={`mb-6 flex flex-wrap items-center gap-3 border border-x-0 z-40 px-4 py-[19px] transition-colors duration-500 sticky top-0 left-0 ${
                    darkMode
                        ? "border-[#272b36] bg-[#11141b]"
                        : "border-slate-200 bg-white"
                }`}
            >
                <span
                    className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium ${
                        value.success
                            ? darkMode
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-emerald-50 text-emerald-700"
                            : darkMode
                              ? "bg-rose-500/10 text-rose-400"
                              : "bg-rose-50 text-rose-700"
                    }`}
                >
                    <span className="relative flex h-2 w-2">
                        {value?.success && (
                            <span className="absolute -inset-[1px] animate-ping rounded-full bg-emerald-400 opacity-60" />
                        )}
                        <span
                            className={`relative inline-flex h-2 w-2 rounded-full ${
                                value?.success ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                        />
                    </span>
                    {value?.success ? "Connected" : "Failed"}
                </span>

                <span
                    className={`text-sm font-medium ${
                        darkMode ? "text-[#e6e9f0]" : "text-slate-700"
                    }`}
                >
                    {value?.provider ?? "--"}
                </span>
                <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${
                        darkMode
                            ? "bg-slate-500/10 text-slate-300"
                            : "bg-slate-100 text-slate-600"
                    }`}
                >
                    <CalendarDays size={12} />
                    {value?.period?.startDate
                        ? formatShortDate(value.period.startDate)
                        : "--"}{" "}
                    ➜{" "}
                    {value?.period?.endDate
                        ? formatShortDate(value.period.endDate)
                        : "--"}
                </span>

                <div
                    className={`ml-auto flex flex-wrap items-center gap-2 text-xs ${
                        darkMode ? "text-[#a0a8b8]" : "text-slate-500"
                    }`}
                >
                    <RefreshCw size={14} />
                    <span>Last synced</span>
                    <span
                        className={`font-medium ${
                            darkMode ? "text-[#e6e9f0]" : "text-slate-700"
                        }`}
                    >
                        {value?.fetchedAt ? formatDate(value.fetchedAt) : "--"}
                    </span>
                </div>
            </div>

            <div className="px-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {kpis?.map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                            <div
                                key={kpi.label}
                                className={`relative rounded-xl border p-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg ${
                                    darkMode
                                        ? "border-[#272b36] bg-[#11141b] hover:border-[#3a3f4d]"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.iconBg} ${kpi.iconColor}`}
                                    >
                                        <Icon size={21} strokeWidth={1.8} />
                                    </div>
                                    {kpi.badge && (
                                        <span
                                            className={`rounded-md px-2 py-1 text-xs font-medium ${
                                                kpi.warning
                                                    ? darkMode
                                                        ? "bg-rose-500/10 text-rose-400"
                                                        : "bg-rose-50 text-rose-700"
                                                    : darkMode
                                                      ? "bg-emerald-500/10 text-emerald-400"
                                                      : "bg-emerald-50 text-emerald-700"
                                            }`}
                                        >
                                            {kpi.badge}
                                        </span>
                                    )}
                                </div>
                                <p
                                    className={`text-sm font-medium ${
                                        darkMode
                                            ? "text-[#a0a8b8]"
                                            : "text-slate-500"
                                    }`}
                                >
                                    {kpi?.label ?? "--"}
                                </p>
                                <p
                                    className={`mt-1 text-xl font-semibold tracking-tight ${
                                        darkMode
                                            ? "text-[#e6e9f0]"
                                            : "text-slate-900"
                                    }`}
                                >
                                    {kpi?.value ?? "--"}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div
                    className={`mt-6 rounded-xl border p-4 transition-colors duration-500 sm:p-5 ${
                        darkMode
                            ? "border-[#272b36] bg-[#11141b]"
                            : "border-slate-200 bg-white"
                    }`}
                >
                    <div className="mb-4">
                        <h2
                            className={`text-sm font-semibold ${
                                darkMode ? "text-[#e6e9f0]" : "text-slate-900"
                            }`}
                        >
                            Daily Cost Trend
                        </h2>
                        <p
                            className={`mt-0.5 text-xs ${
                                darkMode ? "text-[#a0a8b8]" : "text-slate-500"
                            }`}
                        >
                            USD spent per day
                        </p>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 5, right: 8, left: -10, bottom: 20 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={darkMode ? "#272b36" : "#e2e8f0"}
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                stroke={darkMode ? "#697386" : "#94a3b8"}
                                tick={{
                                    fontSize: 12,
                                    fill: darkMode ? "#a0a8b8" : "#64748b",
                                    angle: -30,
                                    textAnchor: "end",
                                }}
                                tickLine={false}
                                axisLine={{
                                    stroke: darkMode ? "#272b36" : "#e2e8f0",
                                }}
                            />
                            <YAxis
                                stroke={darkMode ? "#697386" : "#94a3b8"}
                                tick={{
                                    fontSize: 12,
                                    fill: darkMode ? "#a0a8b8" : "#64748b",
                                }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => `$${v.toFixed(2)}`}
                                // width="auto"
                                width={65}
                            />
                            <Tooltip
                                cursor={{
                                    fill: darkMode ? "#1b1f29" : "#f1f5f9",
                                }}
                                contentStyle={{
                                    background: darkMode
                                        ? "#11141b"
                                        : "#ffffff",
                                    border: `1px solid ${
                                        darkMode ? "#272b36" : "#e2e8f0"
                                    }`,
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                }}
                                labelStyle={{
                                    color: darkMode ? "#e6e9f0" : "#0f172a",
                                    fontWeight: 600,
                                }}
                                itemStyle={{
                                    color: darkMode ? "#8b82ff" : "#5146e5",
                                }}
                                formatter={(value) => [
                                    `$${Number(value).toFixed(4)}`,
                                    "Cost",
                                ]}
                            />
                            <Legend
                                wrapperStyle={{
                                    fontSize: "12px",
                                    color: darkMode ? "#a0a8b8" : "#64748b",
                                    transform: "translateY(20px)",
                                }}
                            />
                            <Bar
                                dataKey="cost"
                                name="Cost (USD)"
                                fill={darkMode ? "#8b82ff" : "#5146e5"}
                                radius={[6, 6, 0, 0]}
                                maxBarSize={48}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="my-6">
                    <div className="mb-3 ml-1">
                        <h2
                            className={`text-sm font-semibold ${
                                darkMode ? "text-[#e6e9f0]" : "text-slate-900"
                            }`}
                        >
                            Model Usage
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {modelCards?.map((model) => {
                            const usage = value?.modelUsage?.[model.key];
                            const Icon = model.icon;
                            const totalTokens =
                                usage?.inputTokens + usage?.outputTokens;

                            return (
                                <div
                                    key={model.key}
                                    className={`relative rounded-xl border p-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg ${
                                        darkMode
                                            ? "border-[#272b36] bg-[#11141b] hover:border-[#3a3f4d]"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                >
                                    <div className="mb-4 flex items-center gap-3">
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${model.iconBg} ${model.iconColor}`}
                                        >
                                            <Icon size={21} strokeWidth={1.8} />
                                        </div>
                                        <div className="min-w-0">
                                            <p
                                                className={`truncate text-sm font-semibold ${
                                                    darkMode
                                                        ? "text-[#e6e9f0]"
                                                        : "text-slate-900"
                                                }`}
                                            >
                                                {model?.name ?? "--"}
                                            </p>
                                            <p
                                                className={`truncate text-[11px] ${
                                                    darkMode
                                                        ? "text-[#697386]"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                {model?.key ?? "--"}
                                            </p>
                                        </div>
                                    </div>

                                    <p
                                        className={`text-xl font-semibold tracking-tight ${
                                            darkMode
                                                ? "text-[#e6e9f0]"
                                                : "text-slate-900"
                                        }`}
                                    >
                                        {usage?.cost != null ? formatUSD4(usage.cost) : "--"}
                                    </p>
                                    <p
                                        className={`text-xs ${
                                            darkMode
                                                ? "text-[#a0a8b8]"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        Total Cost
                                    </p>

                                    <div
                                        className={`my-3 h-px ${
                                            darkMode
                                                ? "bg-[#272b36]"
                                                : "bg-slate-100"
                                        }`}
                                    />
                                    <div className="space-y-1.5 text-xs">
                                        <Row
                                            label="Input"
                                            value={formatNumber(
                                                usage?.inputTokens,
                                            )}
                                            darkMode={darkMode}
                                        />
                                        <Row
                                            label="Output"
                                            value={formatNumber(
                                                usage?.outputTokens,
                                            )}
                                            darkMode={darkMode}
                                        />
                                        <Row
                                            label="Total Tokens"
                                            value={formatNumber(totalTokens)}
                                            darkMode={darkMode}
                                            bold
                                        />
                                        <Row
                                            label="Requests"
                                            value={formatNumber(
                                                usage?.requests,
                                            )}
                                            darkMode={darkMode}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

const Row = ({ label, value, darkMode, bold }) => (
    <div className="flex items-center justify-between">
        <span className={darkMode ? "text-[#a0a8b8]" : "text-slate-500"}>
            {label ?? "--"}
        </span>
        <span
            className={`${bold ? "font-semibold" : "font-medium"} ${
                darkMode ? "text-[#e6e9f0]" : "text-slate-900"
            }`}
        >
            {value ?? "--"}
        </span>
    </div>
);

export default PerplexityData;
