"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Flag,
  PhoneOff,
  MessageSquare,
  GitBranch,
  Wrench,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { CustomNodeData, NodeType } from "@/lib/types/graph";
import { ValidationFinding } from "@/lib/types/validation";
import { cn } from "@/lib/utils";

interface ExtendedNodeData extends CustomNodeData {
  findings?: ValidationFinding[];
  onSelectFinding?: (findingId: string) => void;
}

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as ExtendedNodeData;
  const {
    name = "node",
    type = "conversation",
    description = "",
    transitionsCount = 0,
    findings = [],
    onSelectFinding,
  } = nodeData;



  const getHeaderConfig = (nodeType: NodeType) => {
    switch (nodeType) {
      case "start":
        return {
          bg: "bg-[#f5f3ff] dark:bg-purple-950/40",
          text: "text-[#7c3aed] dark:text-purple-300",
          border: "border-[#ddd6fe] dark:border-purple-800/40",
          icon: <Flag className="h-3.5 w-3.5 text-[#7c3aed]" />,
          label: "START",
        };
      case "closing":
        return {
          bg: "bg-[#fef2f2] dark:bg-rose-950/40",
          text: "text-[#e11d48] dark:text-rose-300",
          border: "border-[#fecdd3] dark:border-rose-800/40",
          icon: <PhoneOff className="h-3.5 w-3.5 text-[#e11d48]" />,
          label: "CLOSING",
        };
      case "router":
        return {
          bg: "bg-[#fffbeb] dark:bg-amber-950/40",
          text: "text-[#d97706] dark:text-amber-300",
          border: "border-[#fde68a] dark:border-amber-800/40",
          icon: <GitBranch className="h-3.5 w-3.5 text-[#d97706]" />,
          label: "ROUTER",
        };
      case "function":
        return {
          bg: "bg-[#ecfdf5] dark:bg-emerald-950/40",
          text: "text-[#059669] dark:text-emerald-300",
          border: "border-[#a7f3d0] dark:border-emerald-800/40",
          icon: <Wrench className="h-3.5 w-3.5 text-[#059669]" />,
          label: "FUNCTION",
        };
      case "conversation":
      default:
        return {
          bg: "bg-[#eff6ff] dark:bg-blue-950/40",
          text: "text-[#2563eb] dark:text-blue-300",
          border: "border-[#bfdbfe] dark:border-blue-800/40",
          icon: <MessageSquare className="h-3.5 w-3.5 text-[#2563eb]" />,
          label: "CONVERSATION",
        };
    }
  };

  const header = getHeaderConfig(type);

  const criticalFindings = findings.filter((f) => f.severity === "critical");
  const warningFindings = findings.filter((f) => f.severity === "warning");
  const hasCritical = criticalFindings.length > 0;
  const hasWarning = warningFindings.length > 0;

  return (
    <div
      className={cn(
        "relative min-w-[280px] max-w-[320px] rounded-xl border bg-white dark:bg-slate-900 shadow-xs transition-all duration-150 select-none",
        selected
          ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
      )}
    >
      {/* Top Handle (Target) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-600 dark:!bg-slate-300 !border-2 !border-white dark:!border-slate-900 transition-transform hover:!scale-125"
      />

      {/* Node Header */}
      <div
        className={cn(
          "flex items-center gap-2 border-b px-4 py-2 rounded-t-xl text-xs font-semibold tracking-wider",
          header.bg,
          header.text,
          header.border
        )}
      >
        {header.icon}
        <span className="uppercase text-[11px] font-bold tracking-wider">{header.label}</span>
      </div>

      {/* Node Body */}
      <div className="p-4">
        <div className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
          {name}
        </div>
        <div className="mt-1.5 line-clamp-3 text-[13px] font-normal leading-relaxed text-slate-500 dark:text-slate-400">
          {description || "No description configured."}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
          <span>
            {transitionsCount} {transitionsCount === 1 ? "transition" : "transitions"}
          </span>
        </div>
      </div>

      {/* Node Bottom State Bar (Errors & Conflicts) */}
      {findings.length > 0 ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectFinding && findings.length > 0) {
              onSelectFinding(findings[0].id);
            }
          }}
          className={cn(
            "flex items-center gap-2 border-t px-3.5 py-2 rounded-b-xl text-xs font-semibold tracking-wide cursor-pointer transition-colors select-none",
            hasCritical
              ? "bg-rose-50/90 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60"
              : "bg-amber-50/90 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60"
          )}
          title="Click to inspect validation details"
        >
          {findings.length === 1 ? (
            /* Single Error / Conflict: state what error it is */
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              {findings[0].severity === "critical" ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <span className="truncate font-medium text-[11px]">
                {findings[0].title}
              </span>
            </div>
          ) : criticalFindings.length > 0 && warningFindings.length > 0 ? (
            /* Multiple errors and conflicts: show two icons beside their respective counts */
            <div className="flex items-center justify-between w-full text-[11px] font-semibold">
              <div className="flex items-center gap-1 text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>
                  {criticalFindings.length} {criticalFindings.length === 1 ? "Error" : "Errors"}
                </span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  {warningFindings.length} {warningFindings.length === 1 ? "Conflict" : "Conflicts"}
                </span>
              </div>
            </div>
          ) : criticalFindings.length > 1 ? (
            /* Multiple errors only */
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{criticalFindings.length} Errors detected</span>
            </div>
          ) : (
            /* Multiple conflicts only */
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{warningFindings.length} Conflicts detected</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Bottom Handle (Source) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-600 dark:!bg-slate-300 !border-2 !border-white dark:!border-slate-900 transition-transform hover:!scale-125"
      />
    </div>
  );
});

CustomNode.displayName = "CustomNode";
