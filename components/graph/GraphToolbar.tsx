"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Upload,
  Download,
  Wand2,
  Undo2,
  Redo2,
  Search,
  Braces,
  ZoomOut,
  ZoomIn,
  Maximize2,
  History,
  ShieldCheck,
  Save,
  Flag,
  PhoneOff,
  MessageSquare,
  GitBranch,
  Wrench,
  Loader2,
  AlertCircle,
  AlertTriangle,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { NodeType } from "@/lib/types/graph";
import { ValidationState } from "@/lib/types/validation";
import { PRESET_TEST_GRAPHS, PresetTestGraph } from "@/lib/graph/testGraphs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GraphToolbarProps {
  onAddNode: (type: NodeType) => void;
  onAutoLayout: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onSearchOpen: () => void;
  onVariablesOpen: () => void;
  onValidateGraph: () => void;
  onCancelValidation?: () => void;
  onSaveGraph: () => void;
  onOpenSimulatedGraphs?: () => void;
  onLoadPresetGraph?: (preset: PresetTestGraph) => void;
  validationState: ValidationState;
  criticalCount?: number;
  warningCount?: number;
}

export function GraphToolbar({
  onAddNode,
  onAutoLayout,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = true,
  onZoomIn,
  onZoomOut,
  onFitView,
  onSearchOpen,
  onVariablesOpen,
  onValidateGraph,
  onCancelValidation,
  onSaveGraph,
  onOpenSimulatedGraphs,
  onLoadPresetGraph,
  validationState,
  criticalCount = 0,
  warningCount = 0,
}: GraphToolbarProps) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Close click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setAddMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectNodeType = (type: NodeType) => {
    onAddNode(type);
    setAddMenuOpen(false);
  };

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-md border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-sm backdrop-blur select-none">
      {/* Add Node Popover Trigger */}
      <div className="relative" ref={addMenuRef}>
        <button
          type="button"
          onClick={() => setAddMenuOpen(!addMenuOpen)}
          className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md text-xs leading-4 font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Add node</span>
        </button>

        {/* Node Type Popover Menu */}
        <AnimatePresence>
          {addMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
              style={{ transformOrigin: "top left" }}
              className="absolute left-0 top-full mt-2 w-48 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg p-1 z-50"
            >
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Node Type
              </div>
              <button
                type="button"
                onClick={() => handleSelectNodeType("conversation")}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs leading-4 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors text-left cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold leading-tight">Conversation</div>
                  <div className="text-[10px] text-slate-400">Handle dialogue turn</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectNodeType("router")}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs leading-4 text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600 transition-colors text-left cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600">
                  <GitBranch className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold leading-tight">Router</div>
                  <div className="text-[10px] text-slate-400">Branch based on intent</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectNodeType("function")}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs leading-4 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition-colors text-left cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold leading-tight">Function / Tool</div>
                  <div className="text-[10px] text-slate-400">Execute API or action</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectNodeType("closing")}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs leading-4 text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 transition-colors text-left cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600">
                  <PhoneOff className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold leading-tight">Closing</div>
                  <div className="text-[10px] text-slate-400">Conclude or end call</div>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

      {/* Import / Export / Auto Layout */}
      <IconButton
        icon={<Upload className="w-4 h-4" />}
        title="Import Graph JSON"
        onClick={() => {}}
      />
      <IconButton
        icon={<Download className="w-4 h-4" />}
        title="Export Graph JSON"
        onClick={() => {}}
      />
      <IconButton
        icon={<Wand2 className="w-4 h-4" />}
        title="Auto Layout Nodes"
        onClick={onAutoLayout}
      />

      <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

      {/* Undo / Redo */}
      <IconButton
        icon={<Undo2 className="w-4 h-4" />}
        title="Undo (Ctrl+Z)"
        disabled={!canUndo}
        onClick={onUndo}
      />
      <IconButton
        icon={<Redo2 className="w-4 h-4" />}
        title="Redo (Ctrl+Y)"
        disabled={!canRedo}
        onClick={onRedo}
      />
      <IconButton
        icon={<Search className="w-4 h-4" />}
        title="Search Nodes (Ctrl+F)"
        onClick={onSearchOpen}
      />
      <IconButton
        icon={<Braces className="w-4 h-4" />}
        title="Variables & Parameters"
        onClick={onVariablesOpen}
      />

      <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

      {/* Zoom / Viewport controls */}
      <IconButton
        icon={<ZoomOut className="w-4 h-4" />}
        title="Zoom Out"
        onClick={onZoomOut}
      />
      <IconButton
        icon={<ZoomIn className="w-4 h-4" />}
        title="Zoom In"
        onClick={onZoomIn}
      />
      <IconButton
        icon={<Maximize2 className="w-4 h-4" />}
        title="Fit View"
        onClick={onFitView}
      />

      <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

      {/* History */}
      <IconButton
        icon={<History className="w-4 h-4" />}
        title="Version History"
        onClick={() => {}}
      />

      {/* Prominent Validate / Cancel Graph Button */}
      {validationState === "analyzing" && onCancelValidation ? (
        <button
          type="button"
          onClick={onCancelValidation}
          title="Cancel AI Validation in progress"
          className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md text-xs leading-4 font-semibold transition-all shadow-xs ml-0.5 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900 cursor-pointer animate-in fade-in"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Reviewing...</span>
          <span className="text-[10px] bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 px-1 py-0.2 rounded-md font-bold hover:bg-rose-300">
            Cancel ✕
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onValidateGraph}
          disabled={validationState === "analyzing"}
          title="Run semantic graph validation"
          className={cn(
            "inline-flex items-center gap-1.5 px-3 h-9 rounded-md text-xs leading-4 font-semibold transition-all shadow-xs ml-0.5 cursor-pointer",
            validationState === "analyzing"
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : validationState === "stale"
              ? "bg-amber-500 hover:bg-amber-600 text-white animate-pulse"
              : validationState === "validated"
              ? criticalCount > 0
                ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
              : validationState === "error"
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          )}
        >
          {validationState === "analyzing" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Reviewing...</span>
            </>
          ) : validationState === "stale" ? (
            <>
              <AlertTriangle className="w-4 h-4" />
              <span>Revalidate Graph</span>
            </>
          ) : validationState === "validated" ? (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Validate Graph</span>
              {criticalCount > 0 && (
                <span className="px-1 py-0.2 rounded-md text-[10px] bg-rose-600 text-white font-bold">
                  {criticalCount}
                </span>
              )}
            </>
          ) : validationState === "error" ? (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>Retry Validation</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Validate Graph</span>
            </>
          )}
        </button>
      )}

      {/* Save Button (36px x 36px) */}
      <button
        type="button"
        onClick={onSaveGraph}
        title="Save Graph (Ctrl+S)"
        className="w-9 h-9 flex items-center justify-center rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
      >
        <Save className="w-4 h-4" />
      </button>
    </div>
  );
}

function IconButton({
  icon,
  title,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer shrink-0"
      )}
    >
      {icon}
    </button>
  );
}
