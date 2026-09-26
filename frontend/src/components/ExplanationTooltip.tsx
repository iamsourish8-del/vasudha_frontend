/**
 * Shared ExplanationTooltip — used by XAI layer across every automated decision.
 * One component, many call sites (occupancy, DR, fault detection).
 */

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

interface ExplanationTooltipProps {
  plainEnglish: string;
  topFeatures?: { feature: string; contribution: number }[];
}

export const ExplanationTooltip: React.FC<ExplanationTooltipProps> = ({
  plainEnglish,
  topFeatures = [],
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 transition-colors"
        aria-label="Why was this decision made?"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Why?</span>
      </button>

      {open && (
        <div className="absolute z-50 left-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-lg p-4 text-sm">
          <p className="text-slate-800 leading-relaxed">{plainEnglish}</p>

          {topFeatures.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-2">
                Top contributing factors
              </p>
              <ul className="space-y-1.5">
                {topFeatures.map((f) => (
                  <li key={f.feature} className="flex justify-between text-xs">
                    <span className="text-slate-600 capitalize">
                      {f.feature.replace(/_/g, " ")}
                    </span>
                    <span className="font-medium text-slate-800">
                      {(f.contribution * 100).toFixed(0)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => setOpen(false)}
            className="mt-3 text-xs text-slate-400 hover:text-slate-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};