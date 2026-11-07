import {
    Wallet,
    Bot,
    PhoneCall,
    Megaphone,
    Users,
    Phone,
    Download,
    RefreshCw,
    CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import ApolloSkeleton from "./ApolloSkeleton";
import { toast } from "react-toastify";

const ApolloData = ({ darkMode }) => {
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(true);

    let backend_url = import.meta.env.VITE_BACKEND_URL;

    const formatNumber = (n) =>
        n == null || n === "" || !Number.isFinite(Number(n))
            ? ""
            : Number(n).toLocaleString("en-IN");

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

    const daysLeft = Math.max(
        0,
        Math.ceil(
            (new Date(value?.billingCycle?.endDate) - new Date()) /
                (1000 * 60 * 60 * 24),
        ),
    );

    const isBillingLow = daysLeft <= 7;

    const kpis = [
        {
            label: "Lead Credits Left",
            value: value?.credits?.leadCredits?.leftOver,
            sub: `of ${value?.credits?.leadCredits?.limit}`,
            icon: Wallet,
            iconBg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50",
            iconColor: darkMode ? "text-emerald-400" : "text-emerald-600",
        },
        {
            label: "AI Credits Left",
            value: value?.credits?.aiCredits?.leftOver,
            sub: `of ${value?.credits?.aiCredits?.limit}`,
            icon: Bot,
            iconBg: darkMode ? "bg-violet-500/10" : "bg-violet-50",
            iconColor: darkMode ? "text-violet-400" : "text-violet-600",
        },
        {
            label: "Broadcast Credits Left",
            value: value?.credits?.broadcastCredits?.leftOver,
            sub: `of ${value?.credits?.broadcastCredits?.limit}`,
            icon: Megaphone,
            iconBg: darkMode ? "bg-rose-500/10" : "bg-rose-50",
            iconColor: darkMode ? "text-rose-400" : "text-rose-600",
        },
        {
            label: "Dialer Credits Left",
            value: value?.credits?.dialerCredits?.leftOver,
            sub: `of ${value?.credits?.dialerCredits?.limit}`,
            icon: PhoneCall,
            iconBg: darkMode ? "bg-sky-500/10" : "bg-sky-50",
            iconColor: darkMode ? "text-sky-400" : "text-sky-600",
        },
    ];

    const creditPools = [
        {
            key: "leadCredits",
            name: "Lead Credits",
            icon: Users,
            iconBg: darkMode ? "bg-indigo-500/10" : "bg-indigo-50",
            iconColor: darkMode ? "text-indigo-400" : "text-indigo-600",
        },
        {
            key: "aiCredits",
            name: "AI Credits",
            icon: Bot,
            iconBg: darkMode ? "bg-violet-500/10" : "bg-violet-50",
            iconColor: darkMode ? "text-violet-400" : "text-violet-600",
        },
        {
            key: "broadcastCredits",
            name: "Broadcast Credits",
            icon: Megaphone,
            iconBg: darkMode ? "bg-rose-500/10" : "bg-rose-50",
            iconColor: darkMode ? "text-rose-400" : "text-rose-600",
        },
        {
            key: "dialerCredits",
            name: "Dialer Credits",
            icon: PhoneCall,
            iconBg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50",
            iconColor: darkMode ? "text-emerald-400" : "text-emerald-600",
        },
        {
            key: "conversationCredits",
            name: "Conversation Credits",
            icon: Phone,
            iconBg: darkMode ? "bg-sky-500/10" : "bg-sky-50",
            iconColor: darkMode ? "text-sky-400" : "text-sky-600",
        },
        {
            key: "directDialCredits",
            name: "Direct Dial Credits",
            icon: PhoneCall,
            iconBg: darkMode ? "bg-slate-500/10" : "bg-slate-100",
            iconColor: darkMode ? "text-slate-400" : "text-slate-600",
        },
        {
            key: "exportCredits",
            name: "Export Credits",
            icon: Download,
            iconBg: darkMode ? "bg-slate-500/10" : "bg-slate-100",
            iconColor: darkMode ? "text-slate-400" : "text-slate-600",
        },
    ];

    const formattedRateLimits = Object.entries(value?.rateLimits || {}).map(
        ([key, w]) => ({
            name: key
                .replace(/\[|\]|"|api\/v1\//g, "")
                .replace(/,/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()),
            day: `${w.day?.consumed || 0} / ${w.day?.limit || 0}`,
            hour: `${w.hour?.consumed || 0} / ${w.hour?.limit || 0}`,
            minute: `${w.minute?.consumed || 0} / ${w.minute?.limit || 0}`,
        }),
    );

    const getAppoloData = async () => {
        try {
            setLoading(true);
            let response = await axios.get(`${backend_url}/api/apollo/usage`);

            if (response?.status === 200) {
                setValue(response?.data);
            }
        } catch (err) {
            toast.error("something went wrong");
            console.log("something went wrong", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAppoloData();
    }, []);

    if (loading) {
        return <ApolloSkeleton darkMode={darkMode} />;
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
                        isBillingLow
                            ? darkMode
                                ? "bg-rose-500/10 text-rose-400"
                                : "bg-rose-50 text-rose-700"
                            : darkMode
                              ? "bg-slate-500/10 text-slate-300"
                              : "bg-slate-100 text-slate-600"
                    }`}
                >
                    <CalendarDays size={12} />
                    {value?.billingCycle?.startDate
                        ? formatShortDate(value.billingCycle.startDate)
                        : "--"}{" "}
                    ➜{" "}
                    {value?.billingCycle?.endDate
                        ? formatShortDate(value.billingCycle.endDate)
                        : "--"}
                    {/* <span className="font-semibold">({daysLeft}d left)</span> */}
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
                                <p
                                    className={`mt-0.5 text-xs ${
                                        darkMode
                                            ? "text-[#697386]"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {kpi?.sub ?? "--"}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6">
                    <div className="mb-3 ml-1">
                        <h2
                            className={`text-sm font-semibold ${
                                darkMode ? "text-[#e6e9f0]" : "text-slate-900"
                            }`}
                        >
                            Credit Pools
                        </h2>
                        <p
                            className={`mt-0.5 text-xs ${
                                darkMode ? "text-[#a0a8b8]" : "text-slate-500"
                            }`}
                        >
                            Usage and remaining credits per pool
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {creditPools.map((pool) => {
                            const Icon = pool.icon;
                            const credit = value?.credits?.[pool.key];

                            const usedPct =
                                credit?.limit > 0
                                    ? ((credit?.consumed || 0) / credit.limit) *
                                      100
                                    : 0;

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
                                    key={pool.key}
                                    className={`relative rounded-xl border p-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg ${
                                        darkMode
                                            ? "border-[#272b36] bg-[#11141b] hover:border-[#3a3f4d]"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                >
                                    <div className="mb-3 flex items-center gap-3">
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${pool.iconBg} ${pool.iconColor}`}
                                        >
                                            <Icon size={18} strokeWidth={1.8} />
                                        </div>
                                        <p
                                            className={`truncate text-sm font-semibold ${
                                                darkMode
                                                    ? "text-[#e6e9f0]"
                                                    : "text-slate-900"
                                            }`}
                                        >
                                            {pool?.name ?? "--"}
                                        </p>
                                    </div>

                                    <p
                                        className={`text-xl font-semibold tracking-tight ${
                                            darkMode
                                                ? "text-[#e6e9f0]"
                                                : "text-slate-900"
                                        }`}
                                    >
                                        {credit?.consumed != null ? formatNumber(credit.consumed) : "--"}
                                        <span
                                            className={`ml-1 text-sm font-normal ${
                                                darkMode
                                                    ? "text-[#697386]"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            / {credit?.limit != null ? formatNumber(credit.limit) : "--"}
                                        </span>
                                    </p>

                                    <div
                                        className={`mt-2 h-2 w-full overflow-hidden rounded-full ${
                                            darkMode
                                                ? "bg-[#272b36]"
                                                : "bg-slate-100"
                                        }`}
                                    >
                                        <div
                                            className={`h-full rounded-full ${barColor}`}
                                            style={{ width: `${usedPct}%` }}
                                        />
                                    </div>

                                    <div
                                        className={`mt-2 flex items-center justify-between text-xs ${
                                            darkMode
                                                ? "text-[#a0a8b8]"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        <span>used</span>
                                        <span className="font-medium">
                                            {usedPct != null ? usedPct.toFixed(0) : "0"}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="my-6">
                    <div className="mb-3 ml-1">
                        <h2
                            className={`text-sm font-semibold ${
                                darkMode ? "text-[#e6e9f0]" : "text-slate-900"
                            }`}
                        >
                            Rate Limits
                        </h2>
                        <p
                            className={`mt-0.5 text-xs ${
                                darkMode ? "text-[#a0a8b8]" : "text-slate-500"
                            }`}
                        >
                            Consumed / limit per API endpoint
                        </p>
                    </div>

                    <div
                        className={`overflow-hidden rounded-xl border transition-colors duration-500 ${
                            darkMode
                                ? "border-[#272b36] bg-[#11141b]"
                                : "border-slate-200 bg-white"
                        }`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr
                                        className={`border-b ${
                                            darkMode
                                                ? "border-[#272b36]"
                                                : "border-slate-200"
                                        }`}
                                    >
                                        <th
                                            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${
                                                darkMode
                                                    ? "text-[#697386]"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            API Endpoint
                                        </th>
                                        <th
                                            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${
                                                darkMode
                                                    ? "text-[#697386]"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            Day
                                        </th>
                                        <th
                                            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${
                                                darkMode
                                                    ? "text-[#697386]"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            Hour
                                        </th>
                                        <th
                                            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${
                                                darkMode
                                                    ? "text-[#697386]"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            Minute
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formattedRateLimits.length > 0 ? (
                                        formattedRateLimits.map((r, i) => (
                                            <tr
                                                key={i}
                                                className={`${
                                                    i !==
                                                    formattedRateLimits.length -
                                                        1
                                                        ? darkMode
                                                            ? "border-b border-[#272b36]"
                                                            : "border-b border-slate-100"
                                                        : ""
                                                }`}
                                            >
                                                <td
                                                    className={`px-4 py-3 font-medium ${darkMode ? "text-[#e6e9f0]" : "text-slate-900"}`}
                                                >
                                                    {r?.name ?? "--"}
                                                </td>
                                                <td
                                                    className={`px-4 py-3 ${darkMode ? "text-[#a0a8b8]" : "text-slate-600"}`}
                                                >
                                                    {r?.day ?? "--"}
                                                </td>
                                                <td
                                                    className={`px-4 py-3 ${darkMode ? "text-[#a0a8b8]" : "text-slate-600"}`}
                                                >
                                                    {r?.hour ?? "--"}
                                                </td>
                                                <td
                                                    className={`px-4 py-3 ${darkMode ? "text-[#a0a8b8]" : "text-slate-600"}`}
                                                >
                                                    {r?.minute ?? "--"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className={`px-4 py-6 text-center text-sm ${darkMode ? "text-[#a0a8b8]" : "text-slate-500"}`}
                                            >
                                                No rate limit data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApolloData;
