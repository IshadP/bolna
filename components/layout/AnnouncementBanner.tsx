"use client";

import React from "react";

export function AnnouncementBanner() {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-1.5 px-4 text-center text-xs text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 select-none z-30">
      <span>You&apos;re currently on a trial plan, which limits outbound calls to your </span>
      <a
        href="#verified-numbers"
        className="text-blue-600 dark:text-blue-400 underline decoration-dotted underline-offset-2 hover:decoration-solid hover:text-blue-700 font-medium"
      >
        verified phone numbers
      </a>
      <span>. To unlock full calling access, please upgrade by adding funds to your account.</span>
    </div>
  );
}
