import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, ChevronDown, Leaf, Sun, Moon, Clock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useBuilding } from "../../contexts/BuildingContext";

const BUILDING_NAMES: Record<string, string> = {
  "bldg-aspiria-01": "Aspiria Campus — Building A",
  "bldg-capgemini-pune": "Capgemini Pune Campus",
};

export const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const { activeBuilding, setActiveBuilding } = useBuilding();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  // Updated: defaults to light mode (false) if no theme is saved in localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return false;
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Updated: removed the 'second: "2-digit"' option
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-emerald-100 dark:border-slate-800 transition-colors duration-200">
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="md:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-400">
            <Leaf className="w-4 h-4" /> Vasudha
          </span>
          {user && user.building_ids.length > 0 && (
            <div className="relative">
              <select
                value={activeBuilding || ""}
                onChange={(e) => setActiveBuilding(e.target.value)}
                className="appearance-none bg-emerald-50/80 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-sm text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer max-w-[220px]"
              >
                {user.building_ids.map((id) => (
                  <option key={id} value={id}>{BUILDING_NAMES[id] || id}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/50 pointer-events-none" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md mr-1 border border-slate-100 dark:border-slate-700">
            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {formattedDate} • {formattedTime}
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Active Notification Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-emerald-700/70 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Alerts</h3>
                  <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full">1 New</span>
                </div>
                <div className="px-4 py-3 text-sm">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">Fault Detection Warning</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Chiller-1 power draw is +14% above the 7-day baseline. Inspect condenser.</p>
                  <p className="text-xs text-slate-400 mt-2">Just now</p>
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:flex flex-col items-end border-l border-slate-200 dark:border-slate-700 pl-3">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight">{user?.full_name}</span>
            <span className="text-xs text-emerald-700/60 dark:text-emerald-400 capitalize">{user?.role?.replace("_", " ")}</span>
          </div>

          <button onClick={() => { logout(); navigate("/login"); }} className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400" title="Sign out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};