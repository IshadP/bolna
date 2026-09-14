"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  Pencil,
  Copy,
  Check,
  Wallet,
  Clock,
  Plus,
  Sparkles,
  CircleHelp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  agentName?: string;
  onRename?: (newName: string) => void;
}

export function AppHeader({ agentName = "New Graph Agent", onRename }: AppHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(agentName);
  const agentId = "401d2586-f359-4555-9efd-85aeba7087cf";

  const handleCopyId = () => {
    navigator.clipboard.writeText(agentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNameSubmit = () => {
    setIsEditingName(false);
    if (onRename && name.trim()) {
      onRename(name.trim());
    }
  };

  return (
    <header className="h-[52px] bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-5 flex items-center justify-between shrink-0 select-none z-10">
      {/* Left: Breadcrumbs + ID */}
      <div className="flex items-center gap-3 min-w-0">
        <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">
            Graph Agents
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          {isEditingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              autoFocus
              className="text-sm font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded outline-none border border-blue-500"
            />
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="group flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 cursor-pointer transition-colors"
            >
              <span>{name}</span>
              <Pencil className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </nav>

        {/* Truncated ID Pill */}
        <button
          onClick={handleCopyId}
          title="Click to copy Agent ID"
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/60 dark:bg-blue-950/40 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-medium transition-colors"
        >
          <span>401d2586-f359-4555-9efd-85aeba708...</span>
          {copied ? (
            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 opacity-70" />
          )}
        </button>
      </div>

      {/* Right: Credits, Minutes, Action buttons */}
      <div className="flex items-center gap-2">
        {/* Balance & Minutes Pill */}
        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs h-8 text-xs font-semibold overflow-hidden">
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors">
            <span className="w-4 h-4 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Wallet className="w-2.5 h-2.5" />
            </span>
            <span>$4.91</span>
          </div>

          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />

          <div className="flex items-center gap-1.5 px-2.5 py-1 text-rose-600 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors">
            <span className="w-4 h-4 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Clock className="w-2.5 h-2.5" />
            </span>
            <span>82</span>
          </div>

          <button
            title="Add funds"
            className="w-7 h-full flex items-center justify-center border-l border-slate-200 dark:border-slate-800 bg-blue-50/60 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* What's new sparkles button */}
        <button
          title="What's New"
          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center shadow-2xs transition-colors"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Help button */}
        <button
          title="Help & Documentation"
          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center shadow-2xs transition-colors"
        >
          <CircleHelp className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
