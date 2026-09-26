/**
 * Skeleton loading state — exact shape of the real command-center cards.
 * Makes the app feel intentional and fast rather than broken.
 */

import React from "react";

const SkeletonCard = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
    <div className="h-3 w-24 bg-slate-200 rounded mb-4" />
    <div className="h-7 w-32 bg-slate-200 rounded mb-2" />
    <div className="h-4 w-40 bg-slate-100 rounded mb-4" />
    <div className="h-3 w-full bg-slate-100 rounded" />
  </div>
);

export const SkeletonDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="h-7 w-64 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-slate-100 rounded mt-2 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};