import axios from "axios";
import {
    Wallet,
    Zap,
    ArrowDownToLine,
    ArrowUpFromLine,
    RefreshCw,
    CalendarDays,
    Bot,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import OpenAIDataSkeleton from "./OpenAIDataSkeleton";
import { toast } from "react-toastify";

const OpenAIData = ({ darkMode }) => {
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(true);

    let backend_url = import.meta.env.VITE_BACKEND_URL;

    const formatNumber = (n) =>
        n == null || n === "" || !Number.isFinite(Number(n))
            ? ""
            : Number(n).toLocaleString("en-IN");

    const formatUSD = (n) => `$${n.toFixed(4)}`;
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

    const cleanModelName = (key) =>
        key
            .replace(/-202\d-\d{2}-\d{2}/, "")
            .replace(/-/g, " ")
            .replace(/\bgpt\b/gi, "GPT")
            .replace(/\b\w/g, (c) => c.toUpperCase());

    const kpis = [
        {
            label: "Total Spent Cost",
            value: `$${value?.summary?.totalCostUSD?.toFixed(2)}`,
            sub: `for ${value?.dailyCosts?.length} days`,
            icon: Wallet,
            iconBg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50",
            iconColor: darkMode ? "text-emerald-400" : "text-emerald-600",
        },
        {
            label: "Total Tokens",
            value: formatNumber(value?.summary?.totalTokens),
            sub: "input + output",
            icon: Zap,
            iconBg: darkMode ? "bg-violet-500/10" : "bg-violet-50",
            iconColor: darkMode ? "text-violet-400" : "text-violet-600",
        },
        {
            label: "Input Tokens",
            value: formatNumber(value?.summary?.totalInputTokens),
            sub: "prompt tokens",
            icon: ArrowDownToLine,
            iconBg: darkMode ? "bg-amber-500/10" : "bg-amber-50",
            iconColor: darkMode ? "text-amber-400" : "text-amber-600",
        },
        {
            label: "Output Tokens",
            value: formatNumber(value?.summary?.totalOutputTokens),
            sub: "completion tokens",
            icon: ArrowUpFromLine,
            iconBg: darkMode ? "bg-sky-500/10" : "bg-sky-50",
            iconColor: darkMode ? "text-sky-400" : "text-sky-600",
        },
    ];

    // chart data
    const chartData = value?.dailyCosts?.map((d) => ({
        date: formatShortDate(d.date),
        cost: d.costUSD,
    }));

    const modelCards = Object.entries(value?.modelUsage || {})
        .map(([key, usage]) => ({
            key,
            name: cleanModelName(key),
            cost: usage?.costUSD ?? 0,
            input: usage?.inputTokens ?? 0,
            output: usage?.outputTokens ?? 0,
            total: (usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0),
        }))
        .sort((a, b) => b.cost - a.cost);

    const openAIData = async () => {
        try {
            setLoading(true);
            let response = await axios.get(`${backend_url}/api/openai/usage`);

            if (response?.status === 200) {
                setValue(response?.data);

                // console.log("openai data: ", response.data);
            }
        } catch (err) {
            toast.error("something went wrong");
            console.log("something went wrong", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        openAIData();
    }, []);

    if (loading) {
        return <OpenAIDataSkeleton darkMode={darkMode} />;
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
                        value?.success
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
                                value?.success
                                    ? "bg-emerald-500"
                                    : "bg-rose-500"
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
                    {value?.period?.start
                        ? formatShortDate(value.period.start)
                        : "--"}{" "}
                    ➜{" "}
                    {value?.period?.end
                        ? formatShortDate(value.period.end)
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                                <div className="mb-4">
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.iconBg} ${kpi.iconColor}`}
                                    >
                                        <Icon size={21} strokeWidth={1.8} />
                                    </div>
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
                                {/* <p
                                className={`mt-0.5 text-xs ${
                                    darkMode ? "text-[#697386]" : "text-slate-400"
                                }`}
                            >
                                {kpi.sub}
                            </p> */}
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
                                    fontSize: 11,
                                    fill: darkMode ? "#a0a8b8" : "#64748b",
                                    angle: -30,
                                    textAnchor: "end",
                                }}
                                tickLine={false}
                                axisLine={{
                                    stroke: darkMode ? "#272b36" : "#e2e8f0",
                                }}
                                interval="preserveStartEnd"
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
                                radius={[4, 4, 0, 0]}
                                maxBarSize={24}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6">
                    <div className="mb-3 ml-1">
                        <h2
                            className={`text-sm font-semibold ${
                                darkMode ? "text-[#e6e9f0]" : "text-slate-900"
                            }`}
                        >
                            Model Usage
                        </h2>
                        <p
                            className={`mt-0.5 text-xs ${
                                darkMode ? "text-[#a0a8b8]" : "text-slate-500"
                            }`}
                        >
                            Breakdown per model (sorted by cost)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
                        {modelCards?.map((model) => (
                            <div
                                key={model.key}
                                className={`relative rounded-xl border p-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg ${
                                    darkMode
                                        ? "border-[#272b36] bg-[#11141b] hover:border-[#3a3f4d]"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                            darkMode
                                                ? "bg-indigo-500/10 text-indigo-400"
                                                : "bg-indigo-50 text-indigo-600"
                                        }`}
                                    >
                                        <Bot size={18} strokeWidth={1.8} />
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
                                    {model?.cost != null ? formatUSD(model.cost) : "--"}
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
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={
                                                darkMode
                                                    ? "text-[#a0a8b8]"
                                                    : "text-slate-500"
                                            }
                                        >
                                            Input
                                        </span>
                                        <span
                                            className={`font-medium ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                                        >
                                            {model?.input != null ? formatNumber(model.input) : "--"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={
                                                darkMode
                                                    ? "text-[#a0a8b8]"
                                                    : "text-slate-500"
                                            }
                                        >
                                            Output
                                        </span>
                                        <span
                                            className={`font-medium ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                                        >
                                            {model?.output != null ? formatNumber(model.output) : "--"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={
                                                darkMode
                                                    ? "text-[#a0a8b8]"
                                                    : "text-slate-500"
                                            }
                                        >
                                            Total Tokens
                                        </span>
                                        <span
                                            className={`font-semibold ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                                        >
                                            {model?.total != null ? formatNumber(model.total) : "--"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OpenAIData;
