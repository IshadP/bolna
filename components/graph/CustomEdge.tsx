"use client";

import React, { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "@xyflow/react";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { CustomEdgeData } from "@/lib/types/graph";
import { ValidationFinding } from "@/lib/types/validation";
import { cn } from "@/lib/utils";

interface ExtendedEdgeData extends CustomEdgeData {
  findings?: ValidationFinding[];
  onSelectFinding?: (findingId: string) => void;
}

export const CustomEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
  }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const edgeData = data as unknown as ExtendedEdgeData;
    const label = edgeData?.label || (edgeData?.transitionType === "always" ? "Always" : "Condition");
    const findings = edgeData?.findings || [];
    const onSelectFinding = edgeData?.onSelectFinding;

    const isAlways = edgeData?.transitionType === "always";
    const hasCritical = findings.some((f) => f.severity === "critical");
    const hasWarning = findings.some((f) => f.severity === "warning" || f.severity === "structural");
    const hasFindings = findings.length > 0;

    // Edge stroke color logic
    const edgeStroke = selected
      ? "#2563eb"
      : hasCritical
      ? "#e11d48"
      : hasWarning
      ? "#d97706"
      : isAlways
      ? "#8b5cf6"
      : "#94a3b8";

    return (
      <>
        {/* Main Edge Path */}
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            strokeWidth: selected ? 2.5 : hasFindings ? 2 : 1.5,
            stroke: edgeStroke,
            strokeDasharray: isAlways && !hasFindings ? undefined : "4,4",
          }}
        />

        {/* Edge Label Pill */}
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="flex flex-col items-center gap-1 z-10 select-none"
          >
            {/* Pill with optional icon beside path */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (hasFindings && onSelectFinding) {
                  onSelectFinding(findings[0].id);
                }
              }}
              className={cn(
                "cursor-pointer rounded-md border px-2.5 py-0.5 text-xs font-medium transition-all shadow-2xs inline-flex items-center gap-1.5",
                selected
                  ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-400/20"
                  : hasCritical
                  ? "border-rose-300 bg-rose-50/90 text-rose-700 hover:bg-rose-100 hover:border-rose-400 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800"
                  : hasWarning
                  ? "border-amber-300 bg-amber-50/90 text-amber-700 hover:bg-amber-100 hover:border-amber-400 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800"
                  : isAlways
                  ? "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 hover:border-violet-300 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
              )}
              title={hasFindings ? findings[0].title : label}
            >
              {hasCritical ? (
                <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
              ) : hasWarning ? (
                <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
              ) : null}
              <span>{label}</span>
            </div>
          </div>
        </EdgeLabelRenderer>
      </>
    );
  }
);

CustomEdge.displayName = "CustomEdge";
