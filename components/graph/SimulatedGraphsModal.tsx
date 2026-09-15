"use client";

import React, { useState } from "react";
import {
  FlaskConical,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Search,
  Layers,
  Activity,
} from "lucide-react";
import { PRESET_TEST_GRAPHS, PresetTestGraph } from "@/lib/graph/testGraphs";
import { cn } from "@/lib/utils";

interface SimulatedGraphsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetTestGraph) => void;
}

export function SimulatedGraphsModal({
  isOpen,
  onClose,
  onSelectPreset,
}: SimulatedGraphsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all");

  if (!isOpen) return null;

  const complexities = [
    "all",
    "Basic",
    "Intermediate",
    "Advanced",
    "Enterprise Multi-Flaw",
    "High Complexity",
  ];

  const filteredPresets = PRESET_TEST_GRAPHS.filter((preset) => {
    const matchesQuery =
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesComplexity =
      selectedComplexity === "all" || preset.complexity === selectedComplexity;

    return matchesQuery && matchesComplexity;
  });

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[88vh] bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Preset Test Scenarios
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {PRESET_TEST_GRAPHS.length} Showcase Presets
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pre-configured voice agent flows with synthetic validation outputs for rapid evaluation and testing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close menu (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Showcase Purpose Only Notice Banner */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 border-b border-purple-100 dark:border-purple-900/50 flex items-center gap-2.5 text-xs text-purple-900 dark:text-purple-200 font-medium">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <span>
            <strong>Showcase Notice:</strong> This menu is for demonstration and showcase purposes only. Selecting a preset loads a ready-to-test conversation graph with cached semantic diagnostics.
          </span>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scenarios by title, flaw, or intent..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Complexity Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {complexities.map((comp) => (
              <button
                key={comp}
                type="button"
                onClick={() => setSelectedComplexity(comp)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all capitalize cursor-pointer",
                  selectedComplexity === comp
                    ? "bg-purple-600 text-white shadow-xs font-semibold"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800"
                )}
              >
                {comp === "all" ? "All Scenarios" : comp}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPresets.map((preset) => {
            const hasErrors = preset.expectedFindings.length > 0;
            const criticals = preset.expectedFindings.filter((f) => f.severity === "critical");
            const warnings = preset.expectedFindings.filter((f) => f.severity === "warning");

            return (
              <div
                key={preset.id}
                className="group relative flex flex-col justify-between p-4 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-150"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {preset.name}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0",
                        preset.complexity === "Basic" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                        preset.complexity === "Intermediate" && "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
                        preset.complexity === "Advanced" && "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                        preset.complexity === "Enterprise Multi-Flaw" && "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
                        preset.complexity === "High Complexity" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      )}
                    >
                      {preset.complexity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Layers className="w-3.5 h-3.5" />
                      {preset.nodes.length} Nodes
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Activity className="w-3.5 h-3.5" />
                      {preset.edges.length} Transitions
                    </span>
                  </div>
                </div>

                {/* Bottom Issue Breakdown + Action */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!hasErrors ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        0 Issues (Clean)
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        {criticals.length > 0 && (
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {criticals.length} {criticals.length === 1 ? "Error" : "Errors"}
                          </span>
                        )}
                        {warnings.length > 0 && (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {warnings.length} {warnings.length === 1 ? "Warning" : "Warnings"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-xs group-hover:shadow-md group-hover:shadow-purple-500/20 cursor-pointer"
                  >
                    <span>Load Graph</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-slate-500">
          <span>
            Loading a scenario will replace the current canvas graph with the chosen template.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
