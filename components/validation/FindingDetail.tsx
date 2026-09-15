"use client";

import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  LocateFixed,
  Layers,
  Sparkles,
} from "lucide-react";
import { ValidationFinding } from "@/lib/types/validation";
import { cn } from "@/lib/utils";

interface FindingDetailProps {
  finding: ValidationFinding;
  onBack: () => void;
  onFocusTarget: (targetId: string, targetType: "node" | "edge") => void;
  onLocateInPrompt?: (nodeId: string, excerpt?: string) => void;
}

export function FindingDetail({
  finding,
  onBack,
  onFocusTarget,
  onLocateInPrompt,
}: FindingDetailProps) {
  const isCritical = finding.severity === "critical";
  const isStructural = finding.severity === "structural";
  const isWarning = finding.severity === "warning";

  const primaryTargetId = finding.primaryNodeId || finding.primaryEdgeId || "";
  const primaryTargetType = finding.primaryNodeId ? "node" : "edge";
  const primaryExcerpt = finding.evidence && finding.evidence.length > 0 ? finding.evidence[0].excerpt : undefined;

  const handleLocateAction = (targetId: string, targetType: "node" | "edge", excerpt?: string) => {
    if (targetType === "node" && onLocateInPrompt) {
      onLocateInPrompt(targetId, excerpt);
    } else {
      onFocusTarget(targetId, targetType);
    }
  };

  return (
    <div className="space-y-4 text-xs select-none pb-6">
      {/* 1. Back to All Issues on top */}
      <div className="flex items-center justify-between pb-1 pt-0.5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-xs transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to all issues</span>
        </button>
      </div>

      {/* 2. Issue Title (16px / bold tracking-tight) */}
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight">
        {finding.title}
      </h3>

      {/* 3. Severity Badge Pill */}
      <div>
        {isCritical ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-[11px] font-bold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 fill-rose-100 dark:fill-rose-950" />
            <span>CRITICAL</span>
          </div>
        ) : isStructural ? (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>STRUCTURAL</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-100 dark:bg-amber-950/40 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 fill-amber-100 dark:fill-amber-950" />
            <span>WARNING</span>
          </div>
        )}
      </div>

      {/* 4. Subtitle / Summary snippet */}
      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-normal">
        {finding.summary}
      </p>

      {/* 5. Affected Node + Locate in Prompt Button */}
      {primaryTargetId && (
        <div className="pt-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                AFFECTED {primaryTargetType}
              </div>
              <div className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                {primaryTargetId}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleLocateAction(primaryTargetId, primaryTargetType, primaryExcerpt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 hover:bg-blue-100/70 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              <span>{primaryTargetType === "node" ? "Locate in Prompt" : "Locate on Canvas"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Detailed Issue Section */}
      <div className="space-y-1.5 pt-2">
        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
          Detailed Issue
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-normal">
          {finding.explanation}
        </p>
      </div>

      {/* 7. Evidence from Graph Section */}
      {finding.evidence && finding.evidence.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Evidence from Graph</span>
          </div>

          <div className="space-y-2">
            {finding.evidence.map((item, idx) => {
              const problemLocationType =
                item.sourceType === "edge"
                  ? "Transition condition"
                  : finding.category === "missing_semantic_path" || finding.category === "ambiguous_transitions"
                  ? "Node transitions"
                  : finding.category === "unconnected_node" || finding.category === "structural_issue"
                  ? "Topology configuration"
                  : "Prompt instructions";

              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-100/80 dark:border-amber-900/40 space-y-2"
                >
                  <div className="font-mono text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-normal">
                    &quot;{item.excerpt}&quot;
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center justify-between pt-0.5 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-400">Source:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{item.sourceType} {item.sourceId}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold bg-amber-100/80 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                        {problemLocationType}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLocateAction(item.sourceId, item.sourceType, item.excerpt)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold font-sans cursor-pointer text-xs inline-flex items-center gap-1 ml-auto"
                    >
                      <span>{item.sourceType === "node" ? "Locate in Prompt" : "Locate on Canvas"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
