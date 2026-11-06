import axios from "axios";
import {
    Wallet,
    CreditCard,
    Cpu,
    Database,
    Search,
    RefreshCw,
    CalendarDays,
    Activity,
    Box,
    HardDrive,
    User,
    ExternalLink,
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
import { useEffect, useState } from "react";
import ApifySkeleton from "./ApifySkeleton";
import { toast } from "react-toastify";

const ApifyData = ({ darkMode }) => {
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(true);

    let backend_url = import.meta.env.VITE_BACKEND_URL;

    const formatNumber = (n) =>
        n == null || n === "" || !Number.isFinite(Number(n))
            ? ""
            : Number(n).toLocaleString("en-IN");

    const formatUSD = (n) => `$${n.toFixed(4)}`;
    const formatShortDate = (iso) =>
        new Date(iso).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    const formatDate = (iso) =>
        new Date(iso).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const cleanServiceName = (key) => {
        const map = {
            DATASET_READS: "Dataset Reads",
            DATASET_TIMED_STORAGE_GBYTE_HOURS: "Dataset Storage",
            DATA_TRANSFER_EXTERNAL_GBYTES: "External Data Transfer",
            KEY_VALUE_STORE_TIMED_STORAGE_GBYTE_HOURS: "KV Store Storage",
            PAID_ACTORS_PER_EVENT: "Paid Actors",
            REQUEST_QUEUE_TIMED_STORAGE_GBYTE_HOURS: "Request Queue Storage",
        };
        return map[key] || key.replace(/_/g, " ");
    };

    const limitCards = [
        {
            title: "Monthly Spend",
            data: value?.monthlySpend,
            icon: Wallet,
            iconBg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50",
            iconColor: darkMode ? "text-emerald-400" : "text-emerald-600",
            isCurrency: true,
        },
        {
            title: "Prepaid Usage",
            data: value?.prepaidUsage,
            icon: CreditCard,
            iconBg: darkMode ? "bg-violet-500/10" : "bg-violet-50",
            iconColor: darkMode ? "text-violet-400" : "text-violet-600",
            isCurrency: true,
        },
        {
            title: "Actor Compute Units",
            data: value?.actorComputeUnits,
            icon: Cpu,
            iconBg: darkMode ? "bg-amber-500/10" : "bg-amber-50",
            iconColor: darkMode ? "text-amber-400" : "text-amber-600",
            isCurrency: false,
        },
        {
            title: "Data Transfer (GB)",
            data: value?.externalDataTransferGB,
            icon: Database,
            iconBg: darkMode ? "bg-sky-500/10" : "bg-sky-50",
            iconColor: darkMode ? "text-sky-400" : "text-sky-600",
            isCurrency: false,
        },
        {
            title: "Proxy Serps",
            data: value?.proxySerps,
            icon: Search,
            iconBg: darkMode ? "bg-rose-500/10" : "bg-rose-50",
            iconColor: darkMode ? "text-rose-400" : "text-rose-600",
            isCurrency: false,
        },
    ];

    const chartData = (
        value?.monthlyUsageDetails?.dailyServiceUsages || []
    ).map((day) => ({
        date: new Date(day.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }),
        cost: Number(day.totalUsageCreditsUsd) || 0,
    }));

    const serviceTable = Object.entries(
        value?.monthlyUsageDetails?.monthlyServiceUsage || {},
    ).map(([key, value]) => ({
        name: cleanServiceName(key),
        quantity: value.quantity,
        amount: value.baseAmountUsd,
    }));

    const getServiceIcon = (name) => {
        if (name.includes("Paid Actors")) return <Activity size={16} />;
        if (name.includes("Dataset Storage")) return <HardDrive size={16} />;
        if (name.includes("Dataset Reads")) return <Database size={16} />;
        if (name.includes("Queue")) return <Box size={16} />;
        return <Database size={16} />;
    };

    const getApifyData = async () => {
        try {
            setLoading(true);
            let response = await axios.get(`${backend_url}/api/apify/usage`);

            if (response?.status === 200) {
                setValue(response?.data);
                // console.log("Apify: ", response.data);
            }
        } catch (err) {
            toast.error("something went wrong");
            console.log("something went wrong", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getApifyData();
    }, []);

    if (loading) {
        return <ApifySkeleton darkMode={darkMode} />;
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
                className={`mb-6 flex flex-wrap items-center gap-3 border border-x-0 z-40 px-4 py-[19px] transition-colors duration-500 sticky top-0 left-0 ${darkMode ? "border-[#272b36] bg-[#11141b]" : "border-slate-200 bg-white"}`}
            >
                <span
                    className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium ${value?.success ? (darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700") : darkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-700"}`}
                >
                    <span className="relative flex h-2 w-2">
                        {value?.success && (
                            <span className="absolute -inset-[1px] animate-ping rounded-full bg-emerald-400 opacity-60" />
                        )}
                        <span
                            className={`relative inline-flex h-2 w-2 rounded-full ${value?.success ? "bg-emerald-500" : "bg-rose-500"}`}
                        />
                    </span>
                    {value?.success ? "Connected" : "Failed"}
                </span>

                <span
                    className={`text-sm font-medium ${darkMode ? "text-[#e6e9f0]" : "text-slate-700"}`}
                >
                    {value?.provider}
                </span>

                <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${darkMode ? "bg-slate-500/10 text-slate-300" : "bg-slate-100 text-slate-600"}`}
                >
                    <CalendarDays size={12} />
                    {formatShortDate(value?.usageCycle?.startAt)} ➜{" "}
                    {formatShortDate(value?.usageCycle?.endAt)}
                </span>

                <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${darkMode ? "bg-indigo-500/10 text-indigo-300" : "bg-indigo-50 text-indigo-700"}`}
                >
                    <User size={12} />
                    {value?.account?.username}
                </span>

                <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${darkMode ? "bg-indigo-500/10 text-indigo-300" : "bg-indigo-50 text-indigo-700"}`}
                >
                    <User size={12} />
                    {value?.account?.email}
                </span>

                <div
                    className={`ml-auto flex flex-wrap items-center gap-2 text-xs ${darkMode ? "text-[#a0a8b8]" : "text-slate-500"}`}
                >
                    <RefreshCw size={14} />
                    <span>Last synced</span>
                    <span
                        className={`font-medium ${darkMode ? "text-[#e6e9f0]" : "text-slate-700"}`}
                    >
                        {formatDate(value?.fetchedAt)}
                    </span>
                </div>
            </div>

            <div className="px-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {limitCards?.map((item) => {
                        const Icon = item.icon;
                        const usedPct = item?.data?.usedPercent;
                        const barColor =
                            usedPct > 80
                                ? darkMode
                                    ? "bg-rose-500"
                                    : "bg-rose-600"
                                : darkMode
                                  ? "bg-emerald-400"
                                  : "bg-emerald-500";

                        return (
                            <div
                                key={item.title}
                                className={`relative rounded-xl border p-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg ${darkMode ? "border-[#272b36] bg-[#11141b] hover:border-[#3a3f4d]" : "border-slate-200 bg-white hover:border-slate-300"}`}
                            >
                                <div className="mb-4 flex items-center gap-2.5">
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg} ${item.iconColor}`}
                                    >
                                        <Icon size={16} strokeWidth={2} />
                                    </div>
                                    <p
                                        className={`truncate text-xs font-semibold ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                                    >
                                        {item.title}
                                    </p>
                                </div>

                                <p
                                    className={`text-xl font-bold tracking-tight ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                                >
                                    {item.isCurrency
                                        ? `$${item?.data?.used.toFixed(2)}`
                                        : formatNumber(item?.data?.used)}
                                </p>
                                <p
                                    className={`mt-0.5 text-[11px] ${darkMode ? "text-[#a0a8b8]" : "text-slate-500"}`}
                                >
                                    Used
                                </p>

                                <div
                                    className={`mt-3 h-2 w-full overflow-hidden rounded-full ${darkMode ? "bg-[#272b36]" : "bg-slate-100"}`}
                                >
                                    <div
                                        className={`h-full rounded-full ${barColor}`}
                                        style={{ width: `${usedPct}%` }}
                                    />
                                </div>

                                <div className="mt-1 flex justify-between text-[10px]">
                                    <span
                                        className={
                                            darkMode
                                                ? "text-[#a0a8b8]"
                                                : "text-slate-500"
                                        }
                                    >
                                        {usedPct}% used
                                    </span>
                                    <span
                                        className={
                                            darkMode
                                                ? "text-[#a0a8b8]"
                                                : "text-slate-500"
                                        }
                                    >
                                        {item?.data?.remainingPercent}% left
                                    </span>
                                </div>

                                <div
                                    className={`my-3 h-px ${darkMode ? "bg-[#272b36]" : "bg-slate-100"}`}
                                />

                                <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between">
                                        <span
                                            className={
                                                darkMode
                                                    ? "text-[#a0a8b8]"
                                                    : "text-slate-500"
                                            }
                                        >
                                            Limit
                                        </span>
                                        <span
                                            className={`font-medium ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                                        >
                                            {item.isCurrency
                                                ? `$${item?.data?.limit?.toFixed(2)}`
                                                : formatNumber(
                                                      item?.data?.limit,
                                                  )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span
                                            className={
                                                darkMode
                                                    ? "text-[#a0a8b8]"
                                                    : "text-slate-500"
                                            }
                                        >
                                            Remaining
                                        </span>
                                        <span
                                            className={`font-medium ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                                        >
                                            {item.isCurrency
                                                ? `$${item?.data?.remaining?.toFixed(2)}`
                                                : formatNumber(
                                                      Number(
                                                          item?.data?.remaining?.toFixed(
                                                              6,
                                                          ),
                                                      ),
                                                  )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6">
                    <div className="mb-3">
                        <h2
                            className={`text-sm font-semibold ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                        >
                            Daily Spend Trend
                        </h2>
                        <p
                            className={`mt-0.5 text-xs ${darkMode ? "text-[#a0a8b8]" : "text-slate-500"}`}
                        >
                            Day-wise usage & cost
                        </p>
                    </div>

                    <div
                        className={`rounded-xl border p-4 sm:p-6 ${
                            darkMode
                                ? "border-[#272b36] bg-[#11141b]"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        {chartData.length === 0 ? (
                            <p
                                className={`text-sm ${darkMode ? "text-[#a0a8b8]" : "text-slate-500"}`}
                            >
                                No daily usage data available.
                            </p>
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart
                                    data={chartData}
                                    margin={{
                                        top: 5,
                                        right: 8,
                                        left: -10,
                                        bottom: 20,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={
                                            darkMode ? "#272b36" : "#e2e8f0"
                                        }
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="date"
                                        stroke={
                                            darkMode ? "#697386" : "#94a3b8"
                                        }
                                        tick={{
                                            fontSize: 12,
                                            fill: darkMode
                                                ? "#a0a8b8"
                                                : "#64748b",
                                            angle: -30,
                                            textAnchor: "end",
                                        }}
                                        tickLine={false}
                                        axisLine={{
                                            stroke: darkMode
                                                ? "#272b36"
                                                : "#e2e8f0",
                                        }}
                                    />
                                    <YAxis
                                        stroke={
                                            darkMode ? "#697386" : "#94a3b8"
                                        }
                                        tick={{
                                            fontSize: 12,
                                            fill: darkMode
                                                ? "#a0a8b8"
                                                : "#64748b",
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) =>
                                            `$${v.toFixed(2)}`
                                        }
                                        // width="auto"
                                        width={65}
                                    />
                                    <Tooltip
                                        cursor={{
                                            fill: darkMode
                                                ? "#1b1f29"
                                                : "#f1f5f9",
                                        }}
                                        contentStyle={{
                                            background: darkMode
                                                ? "#11141b"
                                                : "#ffffff",
                                            border: `1px solid ${darkMode ? "#272b36" : "#e2e8f0"}`,
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                        }}
                                        labelStyle={{
                                            color: darkMode
                                                ? "#e6e9f0"
                                                : "#0f172a",
                                            fontWeight: 600,
                                        }}
                                        itemStyle={{
                                            color: darkMode
                                                ? "#8b82ff"
                                                : "#5146e5",
                                        }}
                                        formatter={(value) => [
                                            `$${Number(value).toFixed(4)}`,
                                            "Cost",
                                        ]}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            fontSize: "12px",
                                            color: darkMode
                                                ? "#a0a8b8"
                                                : "#64748b",
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
                        )}
                    </div>
                </div>
                <div className="mt-6">
                    <div className="mb-3">
                        <h2
                            className={`text-sm font-semibold ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                        >
                            Service Breakdown
                        </h2>
                        <p
                            className={`mt-0.5 text-xs ${darkMode ? "text-[#a0a8b8]" : "text-slate-500"}`}
                        >
                            Cost contribution per service
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {serviceTable.map((s) => {
                            const pct =
                                (s.amount /
                                    value?.monthlyUsageDetails
                                        ?.totalUsageCreditsUsd) *
                                100;

                            const barColor =
                                pct > 80
                                    ? darkMode
                                        ? "bg-rose-500"
                                        : "bg-rose-600"
                                    : darkMode
                                      ? "bg-emerald-400"
                                      : "bg-emerald-500";

                            return (
                                <div
                                    key={s.name}
                                    className={`relative rounded-xl border p-4 transition-all hover:-translate-y-1 hover:shadow-lg ${darkMode ? "border-[#272b36] bg-[#11141b]" : "border-slate-200 bg-white"}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${darkMode ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-600"}`}
                                        >
                                            {getServiceIcon(s.name)}
                                        </div>
                                        <span
                                            className={`text-xs font-semibold ${darkMode ? "text-[#a0a8b8]" : "text-slate-500"}`}
                                        >
                                            {pct.toFixed(2)}%
                                        </span>
                                    </div>

                                    <p
                                        className={`text-sm font-semibold truncate ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                                    >
                                        {s.name}
                                    </p>
                                    <p
                                        className={`text-xs mt-0.5 ${darkMode ? "text-[#a0a8b8]" : "text-slate-500"}`}
                                    >
                                        Qty:{" "}
                                        {s.quantity < 1
                                            ? s.quantity.toFixed(6)
                                            : formatNumber(s.quantity)}
                                    </p>
                                    <p
                                        className={`text-lg font-bold mt-2 ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                                    >
                                        {formatUSD(s.amount)}
                                    </p>

                                    <div
                                        className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${darkMode ? "bg-[#272b36]" : "bg-slate-100"}`}
                                    >
                                        <div
                                            className={`h-full rounded-full ${barColor}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 mb-10">
                    <div className="mb-3">
                        <h2
                            className={`text-sm font-semibold ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                        >
                            My Actors
                        </h2>
                        <p
                            className={`mt-0.5 text-xs ${darkMode ? "text-[#a0a8b8]" : "text-slate-500"}`}
                        >
                            Total {value?.myActors?.length || 0} actors found
                        </p>
                    </div>

                    <div
                        className={`overflow-hidden rounded-xl border ${darkMode ? "border-[#272b36] bg-[#11141b]" : "border-slate-200 bg-white"}`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead
                                    className={`text-xs uppercase ${darkMode ? "bg-[#0b0e14] text-[#a0a8b8]" : "bg-slate-50 text-slate-500"}`}
                                >
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Actor Name
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Username
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Created At
                                        </th>
                                        <th className="px-4 py-3 font-medium text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    className={`divide-y ${darkMode ? "divide-[#272b36]" : "divide-slate-100"}`}
                                >
                                    {value?.myActors?.map((actor) => (
                                        <tr
                                            key={actor.id}
                                            className={`transition-colors ${darkMode ? "hover:bg-[#1a1e27]" : "hover:bg-slate-50"}`}
                                        >
                                            <td
                                                className={`px-4 py-3 font-medium ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                                            >
                                                {actor.name}
                                            </td>
                                            <td
                                                className={`px-4 py-3 ${darkMode ? "text-[#a0a8b8]" : "text-slate-500"}`}
                                            >
                                                {actor.username}
                                            </td>
                                            <td
                                                className={`px-4 py-3 ${darkMode ? "text-[#a0a8b8]" : "text-slate-500"}`}
                                            >
                                                {new Date(
                                                    actor.createdAt,
                                                ).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <a
                                                    href={actor.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${darkMode ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"}`}
                                                >
                                                    Open{" "}
                                                    <ExternalLink size={12} />
                                                </a>
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

export default ApifyData;
