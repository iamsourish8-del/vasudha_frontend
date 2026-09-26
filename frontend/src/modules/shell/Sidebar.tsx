import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Thermometer, Building2, Activity,
  Sun, Sparkles, Trophy, Trees,
} from "lucide-react";
import clsx from "clsx";

const NAV = [
  { to: "/dashboard", label: "Habitat Overview", icon: LayoutDashboard },
  { to: "/occupancy", label: "Occupancy HVAC", icon: Thermometer },
  { to: "/digital-twin", label: "ECBC Digital Twin", icon: Building2 },
  { to: "/faults", label: "Equipment Health", icon: Activity },
  { to: "/grid-solar", label: "Solar & Grid", icon: Sun },
  { to: "/xai", label: "Explainable AI", icon: Sparkles },
  { to: "/tenant", label: "Tenant Hub", icon: Trophy },
];

export const Sidebar: React.FC = () => (
  <aside className="hidden md:flex w-60 flex-col border-r border-emerald-100 bg-white/80 backdrop-blur">
    <div className="h-14 flex items-center gap-2.5 px-4 border-b border-emerald-50">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-700 text-white flex items-center justify-center shadow-sm">
        <Trees className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-emerald-950 leading-tight">Vasudha</p>
        <p className="text-[10px] text-emerald-700/60 uppercase tracking-wider">Green Habitat</p>
      </div>
    </div>
    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              isActive
                ? "bg-emerald-50 text-emerald-900 font-medium shadow-sm shadow-emerald-100"
                : "text-slate-600 hover:bg-emerald-50/60 hover:text-emerald-900"
            )
          }
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="p-3 border-t border-emerald-50">
      <p className="text-[10px] text-emerald-700/40 px-2">NGEC · Sustainable Habitat</p>
    </div>
  </aside>
);
