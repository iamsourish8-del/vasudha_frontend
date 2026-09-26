import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, ChevronDown, Leaf } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-emerald-100">
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="md:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800">
            <Leaf className="w-4 h-4" /> Vasudha
          </span>
          {user && user.building_ids.length > 0 && (
            <div className="relative">
              <select
                value={activeBuilding || ""}
                onChange={(e) => setActiveBuilding(e.target.value)}
                className="appearance-none bg-emerald-50/80 border border-emerald-100 rounded-lg pl-3 pr-8 py-1.5 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer max-w-[220px]"
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
          <button className="relative p-2 rounded-lg text-emerald-700/70 hover:bg-emerald-50" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
          </button>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-800 leading-tight">{user?.full_name}</span>
            <span className="text-xs text-emerald-700/60 capitalize">{user?.role?.replace("_", " ")}</span>
          </div>
          <button onClick={() => { logout(); navigate("/login"); }} className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600" title="Sign out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
