/**
 * Shared AlertBanner — used on the command center and inside modules.
 */

import React from "react";
import clsx from "clsx";
import { AlertTriangle, Info, XCircle } from "lucide-react";

interface AlertBannerProps {
  severity: "info" | "yellow" | "red" | "critical";
  message: string;
  module?: string;
  onDismiss?: () => void;
}

const styles = {
  info: "bg-sky-50 border-sky-200 text-sky-800",
  yellow: "bg-amber-50 border-amber-200 text-amber-900",
  red: "bg-red-50 border-red-200 text-red-900",
  critical: "bg-red-100 border-red-300 text-red-950",
};

const icons = {
  info: Info,
  yellow: AlertTriangle,
  red: XCircle,
  critical: XCircle,
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
  severity,
  message,
  module,
  onDismiss,
}) => {
  const Icon = icons[severity] || Info;

  return (
    <div
      className={clsx(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        styles[severity]
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {module && (
          <span className="font-medium capitalize mr-2 opacity-80">
            [{module.replace("_", " ")}]
          </span>
        )}
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
};