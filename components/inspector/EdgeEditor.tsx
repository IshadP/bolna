"use client";

import React from "react";
import { Trash2, ArrowRight, X } from "lucide-react";
import { CustomEdgeData, TransitionType } from "@/lib/types/graph";
import { cn } from "@/lib/utils";

interface EdgeEditorProps {
  edgeId: string;
  sourceName: string;
  targetName: string;
  data: CustomEdgeData;
  onUpdate: (id: string, partial: Partial<CustomEdgeData>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function EdgeEditor({
  edgeId,
  sourceName,
  targetName,
  data,
  onUpdate,
  onDelete,
  onClose,
}: EdgeEditorProps) {
  const transitionType = data?.transitionType || "always";

  return (
    <div className="space-y-4 text-xs select-none animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="font-bold text-slate-800 dark:text-slate-200">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 mr-1.5">
            Transition:
          </span>
          <span className="text-blue-600 dark:text-blue-400">
            {sourceName} → {targetName}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Transition Type */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
          Transition Trigger Rule
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              onUpdate(edgeId, {
                transitionType: "always",
                label: "Always",
                condition: "Always",
              })
            }
            className={cn(
              "p-2.5 rounded-lg border text-left transition-all",
              transitionType === "always"
                ? "border-violet-600 bg-violet-50 text-violet-700 font-semibold dark:bg-violet-950/60 dark:text-violet-300"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 hover:bg-slate-50"
            )}
          >
            <div className="font-bold text-xs">Always</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Unconditional step
            </div>
          </button>

          <button
            onClick={() =>
              onUpdate(edgeId, {
                transitionType: "condition",
                label: data.condition || "If user agrees",
                condition: data.condition || "If user agrees",
              })
            }
            className={cn(
              "p-2.5 rounded-lg border text-left transition-all",
              transitionType === "condition"
                ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/60 dark:text-blue-300"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 hover:bg-slate-50"
            )}
          >
            <div className="font-bold text-xs">Conditional</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Intent / branch condition
            </div>
          </button>
        </div>
      </div>

      {/* Condition Expression */}
      {transitionType === "condition" && (
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            Branch Condition Expression
          </label>
          <input
            type="text"
            value={data.condition || data.label || ""}
            onChange={(e) =>
              onUpdate(edgeId, {
                condition: e.target.value,
                label: e.target.value,
              })
            }
            placeholder="e.g. user expresses interest or says yes"
            className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-medium text-slate-800 dark:text-slate-200 text-xs outline-none focus:border-blue-500"
          />
        </div>
      )}

      {/* Delete Edge Button */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onDelete(edgeId)}
          className="w-full h-8 px-3 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Transition</span>
        </button>
      </div>
    </div>
  );
}
