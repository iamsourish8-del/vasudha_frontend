import React from "react";
import { Flame, Wind, Droplets, Mountain, CloudSun } from "lucide-react";

export interface PanchabhutasMetrics {
  agni_label?: string;
  vaayu_label?: string;
  jal_label?: string;
  prithvi_label?: string;
  gagan_label?: string;
}

const DEFAULTS = {
  agni_label: "Solar + battery peak shave · 32% load cut",
  vaayu_label: "IAQ OK · CO₂ dilution on demand",
  jal_label: "Cooling tower aware · greywater ready",
  prithvi_label: "Scope-2 CO₂ down · plug-load isolation",
  gagan_label: "58% zone use · daylight harvest active",
};

const ITEMS = [
  { key: "agni_label" as const, name: "Agni", sub: "Energy", icon: Flame, color: "from-amber-50 to-orange-50 border-amber-200 text-amber-950" },
  { key: "vaayu_label" as const, name: "Vaayu", sub: "Air / IAQ", icon: Wind, color: "from-sky-50 to-cyan-50 border-sky-200 text-sky-950" },
  { key: "jal_label" as const, name: "Jal", sub: "Water", icon: Droplets, color: "from-blue-50 to-indigo-50 border-blue-200 text-blue-950" },
  { key: "prithvi_label" as const, name: "Prithvi", sub: "Earth / Carbon", icon: Mountain, color: "from-stone-50 to-emerald-50 border-stone-200 text-stone-900" },
  { key: "gagan_label" as const, name: "Gagan", sub: "Space & Daylight", icon: CloudSun, color: "from-violet-50 to-emerald-50 border-violet-100 text-violet-950" },
];

export const PanchabhutasStrip: React.FC<{ metrics?: PanchabhutasMetrics }> = ({ metrics }) => {
  const m = { ...DEFAULTS, ...metrics };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
      {ITEMS.map(({ key, name, sub, icon: Icon, color }) => (
        <div key={key} className={`rounded-xl border bg-gradient-to-br px-3 py-2.5 ${color}`}>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-90">
            <Icon className="w-3.5 h-3.5" />
            {name}
          </div>
          <p className="text-[10px] opacity-55 mt-0.5">{sub}</p>
          <p className="text-xs font-medium mt-1.5 leading-snug">{m[key]}</p>
        </div>
      ))}
    </div>
  );
};
