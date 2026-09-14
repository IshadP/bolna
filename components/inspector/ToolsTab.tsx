"use client";

import React, { useState } from "react";
import { Plus, Wrench, Calendar, PhoneForwarded, MessageSquare, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export function ToolsTab() {
  const [tools, setTools] = useState<ToolItem[]>([
    {
      id: "check_availability",
      name: "check_availability",
      description: "Checks calendar slot availability for requested date/time.",
      icon: <Calendar className="w-3.5 h-3.5 text-blue-600" />,
      enabled: true,
    },
    {
      id: "book_appointment",
      name: "book_appointment",
      description: "Reserves a time slot in Cal.com/Google Calendar and creates invite.",
      icon: <Calendar className="w-3.5 h-3.5 text-emerald-600" />,
      enabled: true,
    },
    {
      id: "transfer_call",
      name: "transfer_to_human",
      description: "Transfers the live caller to a human support queue or SIP trunk.",
      icon: <PhoneForwarded className="w-3.5 h-3.5 text-purple-600" />,
      enabled: false,
    },
    {
      id: "send_sms",
      name: "send_confirmation_sms",
      description: "Sends an SMS booking link or OTP to caller's phone number.",
      icon: <MessageSquare className="w-3.5 h-3.5 text-amber-600" />,
      enabled: true,
    },
  ]);

  const toggleTool = (id: string) => {
    setTools(
      tools.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  return (
    <div className="space-y-4 text-xs select-none">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            Registered Agent Tools
          </div>
          <div className="text-[11px] text-slate-500">
            Functions invocable by graph nodes and LLM reasoning steps.
          </div>
        </div>
        <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 transition-colors">
          <Plus className="w-3 h-3" />
          <span>Add Tool</span>
        </button>
      </div>

      <div className="space-y-2">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className={cn(
              "p-3 rounded-xl border transition-all",
              tool.enabled
                ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
                : "border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/40 opacity-70"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {tool.icon}
                </div>
                <div>
                  <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {tool.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {tool.description}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleTool(tool.id)}
                className={cn(
                  "w-8 h-4.5 rounded-full p-0.5 transition-colors shrink-0",
                  tool.enabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                )}
              >
                <div
                  className={cn(
                    "w-3.5 h-3.5 rounded-full bg-white transition-transform",
                    tool.enabled ? "translate-x-3.5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
