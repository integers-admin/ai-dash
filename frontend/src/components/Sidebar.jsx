import { useState } from "react";
import {
    Users,
    BrainCircuit,
    Workflow,
    Bot,
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/Int_logo.svg";
import logo_1 from "../assets/Int_logo1.svg";
import logo_2 from "../assets/Int_fav.svg";

const NAV = [
    { to: "/", label: "Apify", icon: <Workflow size={17} /> },
    { to: "/openai", label: "OpenAI", icon: <Bot size={17} /> },
    { to: "/perplexity", label: "Perplexity", icon: <BrainCircuit size={17} /> },
    { to: "/apollo", label: "Apollo", icon: <Users size={17} /> },
];

const Sidebar = ({ darkMode, setDarkMode }) => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`hidden h-full shrink-0 overflow-hidden border-r transition-all duration-300 md:flex md:flex-col ${
                collapsed ? "w-[72px]" : "w-[220px]"
            } ${darkMode ? "border-[#272b36] bg-[#11141b]" : "border-[#e4e7ec] bg-white"}`}
        >
            <div
                className={`flex h-[64px] shrink-0 items-center border-b transition-colors duration-500 ${
                    collapsed ? "justify-center" : "px-5"
                } ${darkMode ? "border-[#272b36]" : "border-[#edf0f3]"}`}
            >
                <div
                    onClick={() => navigate("/")}
                    className={`flex cursor-pointer items-center justify-center ${
                        collapsed
                            ? `h-9 w-9 rounded-md text-lg font-bold ${
                                  darkMode
                                      ? "bg-[#25233f] text-[#8b82ff]"
                                      : "bg-[#ecebff] text-[#5146e5]"
                              }`
                            : "h-[40px] w-[150px]"
                    }`}
                >
                    {collapsed ? (
                        <img
                            src={logo_2}
                            alt="logo"
                            className="h-full w-full"
                        />
                    ) : (
                        <img
                            src={darkMode ? logo : logo_1}
                            alt="logo"
                            className="h-full w-full"
                        />
                    )}
                </div>
            </div>

            <nav
                className={`flex-1 overflow-hidden py-5 ${collapsed ? "px-2" : "px-3"}`}
            >
                <div className="space-y-1">
                    {NAV.map((item) => (
                        <SidebarItem
                            key={item.to}
                            to={item.to}
                            label={item.label}
                            icon={item.icon}
                            darkMode={darkMode}
                            collapsed={collapsed}
                        />
                    ))}
                </div>
            </nav>

            <div
                className={`shrink-0 border-t py-4 ${collapsed ? "px-2" : "px-3"} ${
                    darkMode ? "border-[#272b36]" : "border-[#edf0f3]"
                }`}
            >
                <FooterButton
                    onClick={() => setDarkMode(!darkMode)}
                    collapsed={collapsed}
                    darkMode={darkMode}
                    icon={
                        <span
                            className={`transition-transform duration-500 ${
                                darkMode ? "rotate-180" : ""
                            }`}
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </span>
                    }
                    label={darkMode ? "Light mode" : "Dark mode"}
                />
                <FooterButton
                    onClick={() => setCollapsed((c) => !c)}
                    collapsed={collapsed}
                    darkMode={darkMode}
                    icon={collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    label="Collapse"
                    className="mt-2"
                />
            </div>
        </aside>
    );
};

const SidebarItem = ({ to, icon, label, darkMode, collapsed }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex h-9 items-center rounded-md text-[14px] transition-colors duration-500 ${
                collapsed ? "justify-center" : "px-3"
            } ${
                isActive
                    ? darkMode
                        ? "bg-[#25233f] font-medium text-[#8b82ff]"
                        : "bg-[#ecebff] font-medium text-[#5146e5]"
                    : darkMode
                      ? "text-[#a0a8b8] hover:bg-[#1b1f29]"
                      : "text-[#667085] hover:bg-gray-50"
            }`
        }
    >
        {({ isActive }) => (
            <>
                <span
                    className={`flex items-center ${collapsed ? "" : "mr-2.5"} ${
                        isActive
                            ? darkMode
                                ? "text-[#8b82ff]"
                                : "text-[#5146e5]"
                            : darkMode
                              ? "text-[#778196]"
                              : "text-[#91a0b5]"
                    }`}
                >
                    {icon}
                </span>
                {!collapsed && <span>{label}</span>}
            </>
        )}
    </NavLink>
);

const FooterButton = ({
    onClick,
    collapsed,
    darkMode,
    icon,
    label,
    className = "",
}) => (
    <button
        onClick={onClick}
        className={`flex h-9 w-full cursor-pointer items-center rounded-md text-[13px] transition-all duration-500 ${
            collapsed ? "justify-center" : "px-3"
        } ${
            darkMode
                ? "text-[#a0a8b8] hover:bg-[#1b1f29]"
                : "text-[#667085] hover:bg-gray-50"
        } ${className}`}
    >
        <span className={`flex items-center ${collapsed ? "" : "mr-2.5"}`}>
            {icon}
        </span>
        {!collapsed && <span>{label}</span>}
    </button>
);

export default Sidebar;
