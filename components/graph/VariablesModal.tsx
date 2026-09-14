"use client";

import React from "react";
import { Braces, X, Copy, Check } from "lucide-react";
import { useState } from "react";

interface VariablesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VariablesModal({ isOpen, onClose }: VariablesModalProps) {
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  if (!isOpen) return null;

  const variables = [
    { key: "{{caller_name}}", desc: "Full name extracted from caller or phone book" },
    { key: "{{caller_phone}}", desc: "E.164 phone number of the inbound/outbound party" },
    { key: "{{appointment_time}}", desc: "Formatted appointment slot ISO string" },
    { key: "{{service_type}}", desc: "Identified booking or support service topic" },
    { key: "{{session_id}}", desc: "Unique telephony execution identifier" },
  ];

  const handleCopy = (v: string) => {
    navigator.clipboard.writeText(v);
    setCopiedVar(v);
    setTimeout(() => setCopiedVar(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center select-none animate-in fade-in duration-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
            <Braces className="w-4 h-4 text-blue-600" />
            <span>Graph Context Variables</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Inject dynamic context into any node prompt or router condition using standard double-brace syntax.
        </p>

        <div className="space-y-2">
          {variables.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950"
            >
              <div>
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {item.key}
                </span>
                <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
              </div>
              <button
                onClick={() => handleCopy(item.key)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-600 dark:text-slate-300 transition-colors"
                title="Copy variable tag"
              >
                {copiedVar === item.key ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
