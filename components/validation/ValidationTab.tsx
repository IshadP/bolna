"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  AlertTriangle,
  RotateCw,
  Loader2,
  ChevronRight,
  Sparkles,
  FlaskConical,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowLeft,
  X,
} from "lucide-react";
import { Node, Edge } from "@xyflow/react";
import { CustomNodeData, CustomEdgeData } from "@/lib/types/graph";
import {
  ValidationFinding,
  ValidationResult,
  ValidationState,
  ApiValidationError,
} from "@/lib/types/validation";
import { FindingDetail } from "./FindingDetail";
import { PresetTestGraph } from "@/lib/graph/testGraphs";
import { cn } from "@/lib/utils";

interface ValidationTabProps {
  status: ValidationState;
  result: ValidationResult | null;
  error: ApiValidationError | null;
  selectedFinding: ValidationFinding | null;
  onSelectFinding: (finding: ValidationFinding | null) => void;
  onRunValidation: () => void;
  onCancelValidation?: () => void;
  onDismissError?: () => void;
  onFocusTarget: (targetId: string, targetType: "node" | "edge") => void;
  onLoadPresetGraph?: (preset: PresetTestGraph) => void;
  selectedNode?: Node<CustomNodeData> | null;
  selectedEdge?: Edge<CustomEdgeData> | null;
  onClearSelection?: () => void;
}

export function ValidationTab({
  status,
  result,
  error,
  selectedFinding,
  onSelectFinding,
  onRunValidation,
  onCancelValidation,
  onDismissError,
  onFocusTarget,
  onLoadPresetGraph,
  selectedNode,
  selectedEdge,
  onClearSelection,
}: ValidationTabProps) {
  // Simulated progress steps during AI analysis
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (status === "analyzing") {
      setLoadingStep(0);
      const t1 = setTimeout(() => setLoadingStep(1), 600);
      const t2 = setTimeout(() => setLoadingStep(2), 1400);
      const t3 = setTimeout(() => setLoadingStep(3), 2200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [status]);

  // If a finding is actively selected, show its deep detail view
  if (selectedFinding) {
    return (
      <FindingDetail
        finding={selectedFinding}
        onBack={() => {
          onSelectFinding(null);
          if (onClearSelection) {
            onClearSelection();
          }
        }}
        onFocusTarget={onFocusTarget}
      />
    );
  }

  // STATE 1: Never Validated (Empty state matching Figma node 2343:2363)
  if (status === "never_validated" && !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] h-full px-6 text-center select-none animate-in fade-in duration-200">
        <div className="max-w-[320px] mx-auto flex flex-col items-center">
          {/* Title: 16px/24px Bold */}
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Validate Your Call Flow
          </h3>

          {/* Subtitle description: 12px/20px regular slate */}
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400 font-normal">
            AI checks every node, prompt, and transition for gaps, dead ends, and conversational inconsistencies before you go live.
          </p>

          {/* Action Button: 40px (h-10) height, 12px radius, blue-600 background, shield check icon */}
          <button
            type="button"
            onClick={onRunValidation}
            className="mt-6 h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs inline-flex items-center justify-center gap-2 shadow-sm shadow-blue-500/15 transition-all cursor-pointer select-none"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Review Graph Agent</span>
          </button>
        </div>
      </div>
    );
  }

  // STATE 2: Analyzing (Loading with Cancel option)
  if (status === "analyzing") {
    const steps = [
      "Normalizing graph topology & prompts...",
      "Sending payload to validator...",
      "Performing semantic reasoning & checks...",
      "Validating output against schema...",
    ];

    return (
      <div className="space-y-4 text-xs select-none">
        <div className="text-center py-8 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-2xs">
          <div className="relative w-12 h-12 mx-auto">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <Sparkles className="w-5 h-5 text-blue-500 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Reviewing graph with AI...
            </div>
            <div className="text-slate-500 text-[11px] font-medium h-4">
              {steps[loadingStep]}
            </div>
          </div>

          {onCancelValidation && (
            <button
              type="button"
              onClick={onCancelValidation}
              className="mt-2 h-8 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 font-semibold text-[11px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Processing</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // STATE 3: Error
  if (status === "error" || error) {
    return (
      <div className="space-y-4 text-xs select-none">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 text-rose-900 dark:text-rose-200 space-y-3 relative">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5 min-w-0">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0">
                <div className="font-bold text-sm">Couldn&apos;t review this graph.</div>
                <div className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed font-sans break-words">
                  {error?.message || "An error occurred while connecting to OpenRouter."}
                </div>
              </div>
            </div>
            {onDismissError && (
              <button
                type="button"
                onClick={onDismissError}
                title="Dismiss and return to validation tab"
                className="p-1 rounded-md text-rose-400 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {error?.code === "CONFIG_ERROR" && (
            <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-800 text-[11px] font-mono space-y-1">
              <div className="font-sans font-semibold text-slate-800 dark:text-slate-200">
                Setup Instructions:
              </div>
              <p className="font-sans text-slate-600 dark:text-slate-400">
                Create a <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env.local</code> file in your project root with your OpenRouter key:
              </p>
              <div className="p-1.5 rounded bg-slate-950 text-emerald-400 text-[10px]">
                OPENROUTER_API_KEY=sk-or-v1-...
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onRunValidation}
              className="flex-1 h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Try again</span>
            </button>
            {onDismissError && (
              <button
                type="button"
                onClick={onDismissError}
                className="px-3 h-8 rounded-lg border border-rose-200 dark:border-rose-800 bg-white/80 dark:bg-slate-900/80 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // All findings
  const allFindings = result?.findings || [];

  // If a node is selected on the canvas, filter findings specifically for this node!
  const nodeName = selectedNode?.data?.name?.toLowerCase();
  const selectedNodeId = selectedNode?.id;

  const findings = selectedNode && selectedNodeId
    ? allFindings.filter(
        (f) =>
          !f.primaryEdgeId &&
          (f.primaryNodeId === selectedNodeId ||
            (nodeName && f.primaryNodeId?.toLowerCase() === nodeName))
      )
    : selectedEdge
    ? allFindings.filter((f) => f.primaryEdgeId === selectedEdge.id)
    : allFindings;

  const criticalFindings = findings.filter((f) => f.severity === "critical");
  const structuralFindings = findings.filter((f) => f.severity === "structural");
  const warningFindings = findings.filter((f) => f.severity === "warning");
  const isStale = status === "stale";
  const isClean = result && allFindings.length === 0;

  // Handle finding click: focus canvas target + open detail
  const handleFindingItemClick = (finding: ValidationFinding) => {
    onSelectFinding(finding);
    if (finding.primaryNodeId) {
      onFocusTarget(finding.primaryNodeId, "node");
    } else if (finding.primaryEdgeId) {
      onFocusTarget(finding.primaryEdgeId, "edge");
    }
  };

  return (
    <div className="space-y-4 text-xs select-none pb-6">
      {/* 1. Header: Review Finding + Review Again button */}
      <div className="flex items-start justify-between gap-2 pt-1 pb-1">
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Review Finding
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-normal">
            Last reviewed {result ? formatTimeAgo(result.timestamp) : "just now"}
          </p>
        </div>

        <button
          type="button"
          onClick={onRunValidation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 hover:bg-blue-100/70 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold text-xs transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Review Again</span>
        </button>
      </div>

      <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800" />

      {/* 2. Total issues count + Pills */}
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {findings.length} issues found
        </div>

        {/* Status Pill Badges: [ (!) 2 ] [ (/\) 3 ] [ [o-o] 3 ] */}
        <div className="flex items-center gap-2 mt-2.5">
          {/* Critical Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 fill-rose-100 dark:fill-rose-950" />
            <span>{criticalFindings.length}</span>
          </div>

          {/* Warning Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 dark:bg-amber-950/40 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 fill-amber-100 dark:fill-amber-950" />
            <span>{warningFindings.length}</span>
          </div>

          {/* Structural Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>{structuralFindings.length}</span>
          </div>
        </div>
      </div>

      {/* Show all issues button when filtered for a specific node/edge */}
      {(selectedNode || selectedEdge) && onClearSelection && (
        <div className="pt-0.5">
          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-xs transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Show all issues</span>
          </button>
        </div>
      )}

      {/* 3. Findings list categorized by CRITICAL, STRUCTURAL, WARNINGS */}
      <div className={cn("space-y-5 pt-1", isStale && "opacity-60")}>
        {/* CRITICAL SECTION */}
        {criticalFindings.length > 0 && (
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 px-0.5">
              CRITICAL ({criticalFindings.length})
            </div>
            <div className="p-2 rounded-2xl bg-gradient-to-b from-rose-50/80 via-rose-50/30 to-transparent dark:from-rose-950/30 dark:via-rose-950/10 dark:to-transparent space-y-1">
              {criticalFindings.map((finding) => (
                <FindingListItem
                  key={finding.id}
                  finding={finding}
                  onClick={() => handleFindingItemClick(finding)}
                />
              ))}
            </div>
          </div>
        )}

        {/* STRUCTURAL SECTION */}
        {structuralFindings.length > 0 && (
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 px-0.5">
              STRUCTURAL ({structuralFindings.length})
            </div>
            <div className="p-2 rounded-2xl bg-gradient-to-b from-slate-100/80 via-slate-50/30 to-transparent dark:from-slate-800/40 dark:via-slate-850/10 dark:to-transparent space-y-1">
              {structuralFindings.map((finding) => (
                <FindingListItem
                  key={finding.id}
                  finding={finding}
                  onClick={() => handleFindingItemClick(finding)}
                />
              ))}
            </div>
          </div>
        )}

        {/* WARNINGS SECTION */}
        {warningFindings.length > 0 && (
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 px-0.5">
              WARNINGS ({warningFindings.length})
            </div>
            <div className="p-2 rounded-2xl bg-gradient-to-b from-amber-50/80 via-amber-50/30 to-transparent dark:from-amber-950/30 dark:via-amber-950/10 dark:to-transparent space-y-1">
              {warningFindings.map((finding) => (
                <FindingListItem
                  key={finding.id}
                  finding={finding}
                  onClick={() => handleFindingItemClick(finding)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Clean State */}
        {isClean && (
          <div className="text-center py-8 px-4 rounded-xl bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
              No semantic or structural issues detected
            </div>
            <div className="text-[11px] mt-1 leading-relaxed text-slate-500">
              Verified that all node prompts, transition paths, and conversational intents are clear and consistent.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FindingListItem({
  finding,
  onClick,
}: {
  finding: ValidationFinding;
  onClick: () => void;
}) {
  const nodeTarget = finding.primaryNodeId || "graph";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-3.5 rounded-xl bg-transparent hover:bg-white/90 dark:hover:bg-slate-900/90 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 hover:shadow-xs transition-all group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          {/* Title */}
          <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {finding.title}
          </div>

          {/* Node target with 'at ' prefix in blue font */}
          <div className="text-[11px] font-mono text-slate-400">
            <span>at </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{nodeTarget}</span>
          </div>

          {/* Summary description preview */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed pt-0.5">
            {finding.summary}
          </div>
        </div>

        {/* Chevron Right */}
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
      </div>
    </button>
  );
}

function formatTimeAgo(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  return `${diffMin}m ago`;
}
