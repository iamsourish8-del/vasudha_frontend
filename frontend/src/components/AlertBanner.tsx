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
  info: "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800/50 text-sky-800 dark:text-sky-300",
  yellow: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-300",
  red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-300",
  critical: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700/50 text-red-950 dark:text-red-200",
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
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors duration-200",
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