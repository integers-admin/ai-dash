import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = ({ darkMode }) => {
    return (
        <div
            className={`flex min-h-screen flex-col items-center justify-center px-6 transition-colors duration-500 ${
                darkMode ? "bg-[#0b0e14]" : "bg-slate-50"
            }`}
        >
            <h1
                className={`text-[120px] font-black leading-none tracking-tighter sm:text-[180px] ${
                    darkMode ? "text-[#272b36]" : "text-gray-600"
                }`}
            >
                404
            </h1>
            <h2
                className={`text-2xl font-bold sm:text-3xl ${
                    darkMode ? "text-[#e6e9f0]" : "text-slate-900"
                }`}
            >
                Page not found
            </h2>
            <p
                className={`mt-3 max-w-md text-center text-sm sm:text-base ${
                    darkMode ? "text-[#a0a8b8]" : "text-slate-500"
                }`}
            >
                The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                    to="/"
                    className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors ${
                        darkMode
                            ? "border-[#272b36] text-[#e6e9f0] hover:bg-[#11141b]"
                            : "border-slate-200 text-slate-700 hover:bg-white"
                    }`}
                >
                    <Home size={16} />
                    Go Home
                </Link>
            </div>
            <p
                className={`mt-16 text-xs ${
                    darkMode ? "text-[#4a5262]" : "text-slate-400"
                }`}
            >
                Error code: 404 · Page not found
            </p>
        </div>
    );
};

export default NotFound;
