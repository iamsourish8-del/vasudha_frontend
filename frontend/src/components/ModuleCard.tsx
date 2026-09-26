import React from "react";
import clsx from "clsx";

interface ModuleCardProps {
  title: string;
  status?: "healthy" | "warning" | "critical" | "unknown";
  primary: string;
  secondary?: string;
  detail?: string;
  onClick?: () => void;
}

const statusStyles = {
  healthy: "border-emerald-200/80 bg-white hover:border-emerald-300",
  warning: "border-amber-200 bg-amber-50/40 hover:border-amber-300",
  critical: "border-red-200 bg-red-50/40 hover:border-red-300",
  unknown: "border-slate-200 bg-white",
};
const statusDot = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
  unknown: "bg-slate-400",
};

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title, status = "unknown", primary, secondary, detail, onClick,
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "w-full text-left rounded-2xl border p-5 transition-all duration-200",
      "hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
      statusStyles[status]
    )}
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xs font-medium text-slate-500 tracking-wide uppercase">{title}</h3>
      <span className={clsx("w-2.5 h-2.5 rounded-full", statusDot[status])} title={status} />
    </div>
    <p className="text-lg font-semibold text-slate-900 tracking-tight leading-snug">{primary}</p>
    {secondary && <p className="mt-1 text-sm text-slate-600">{secondary}</p>}
    {detail && <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">{detail}</p>}
  </button>
);
