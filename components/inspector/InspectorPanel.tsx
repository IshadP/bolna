"use client";

import React, { useState } from "react";
import {
  Maximize2,
  Minimize2,
  X,
  Bot,
  Wrench,
  FlaskConical,
  ShieldCheck,
  ChevronRight,
  Layers,
} from "lucide-react";
import { AgentSetupTab } from "./AgentSetupTab";
import { ToolsTab } from "./ToolsTab";
import { TestAgentTab } from "./TestAgentTab";
import { ValidationTab } from "../validation/ValidationTab";
import { NodeEditor } from "./NodeEditor";
import { EdgeEditor } from "./EdgeEditor";
import { CustomNodeData, CustomEdgeData } from "@/lib/types/graph";
import {
  ValidationFinding,
  ValidationResult,
  ValidationState,
  ApiValidationError,
} from "@/lib/types/validation";
import { PresetTestGraph } from "@/lib/graph/testGraphs";
import { Node, Edge } from "@xyflow/react";
import { cn } from "@/lib/utils";

export type InspectorTabType = "setup" | "tools" | "test" | "validation";

interface InspectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: InspectorTabType;
  onTabChange: (tab: InspectorTabType) => void;
  selectedNode: Node<CustomNodeData> | null;
  selectedEdge: Edge<CustomEdgeData> | null;
  onUpdateNode: (id: string, partial: Partial<CustomNodeData>) => void;
  onDeleteNode: (id: string) => void;
  onDuplicateNode?: (id: string) => void;
  onAddTransition?: (sourceId: string) => void;
  onUpdateEdge: (id: string, partial: Partial<CustomEdgeData>) => void;
  onDeleteEdge: (id: string) => void;
  onClearSelection: () => void;
  // Validation Props
  validationState: ValidationState;
  validationResult: ValidationResult | null;
  validationError: ApiValidationError | null;
  selectedFinding: ValidationFinding | null;
  onSelectFinding: (finding: ValidationFinding | null) => void;
  onRunValidation: () => void;
  onCancelValidation?: () => void;
  onDismissError?: () => void;
  onFocusTarget: (targetId: string, targetType: "node" | "edge") => void;
  onLoadPresetGraph?: (preset: PresetTestGraph) => void;
  nodes: Node<CustomNodeData>[];
  edges?: Edge<CustomEdgeData>[];
}

export function InspectorPanel({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  onAddTransition,
  onUpdateEdge,
  onDeleteEdge,
  onClearSelection,
  validationState,
  validationResult,
  validationError,
  selectedFinding,
  onSelectFinding,
  onRunValidation,
  onCancelValidation,
  onDismissError,
  onFocusTarget,
  onLoadPresetGraph,
  nodes,
  edges = [],
}: InspectorPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) return null;

  const getSourceNodeName = (edge: Edge<CustomEdgeData>) => {
    const node = nodes.find((n) => n.id === edge.source);
    return node?.data.name || edge.source;
  };

  const getTargetNodeName = (edge: Edge<CustomEdgeData>) => {
    const node = nodes.find((n) => n.id === edge.target);
    return node?.data.name || edge.target;
  };

  return (
    <aside
      className={cn(
        "h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 select-none transition-all duration-200 shadow-lg z-20",
        isExpanded ? "w-[520px]" : "w-[380px]"
      )}
    >
      {/* Inspector Header */}
      <div className="h-[52px] px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Inspector
          </span>
          {selectedNode && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
              Node: {selectedNode.data.name}
            </span>
          )}
          {selectedEdge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300 font-semibold">
              Edge
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isExpanded ? "Collapse width" : "Expand width"}
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Inspector"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation:
          - When a node is selected: show [Setup] and [Validate] (with node issue counter)
          - When no node or edge is selected: show [Agent setup, Tools, Test agent, Validation]
      */}
      {selectedNode ? (
        <div className="p-3 pb-0">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-semibold text-slate-500">
            <button
              onClick={() => onTabChange("setup")}
              className={cn(
                "py-1.5 px-2 rounded-md text-center transition-all truncate text-[11px]",
                activeTab === "setup"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              Setup
            </button>

            <button
              onClick={() => onTabChange("validation")}
              className={cn(
                "py-1.5 px-2 rounded-md text-center transition-all truncate text-[11px] inline-flex items-center justify-center gap-1.5",
                activeTab === "validation"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <span>Validate</span>
              {(() => {
                const nodeName = selectedNode.data?.name?.toLowerCase();
                const nodeFindings =
                  validationResult?.findings.filter(
                    (f) =>
                      !f.primaryEdgeId &&
                      (f.primaryNodeId === selectedNode.id ||
                        (nodeName && f.primaryNodeId?.toLowerCase() === nodeName))
                  ) || [];

                if (nodeFindings.length === 0) return null;
                const hasCritical = nodeFindings.some((f) => f.severity === "critical");

                return (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[9px] font-bold text-white",
                      hasCritical ? "bg-rose-500" : "bg-amber-500"
                    )}
                  >
                    {nodeFindings.length}
                  </span>
                );
              })()}
            </button>
          </div>
        </div>
      ) : !selectedEdge && (
        <div className="p-3 pb-0">
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-semibold text-slate-500">
            <button
              onClick={() => {
                onTabChange("setup");
                onClearSelection();
              }}
              className={cn(
                "py-1.5 px-1 rounded-md text-center transition-all truncate text-[11px]",
                activeTab === "setup"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              Agent setup
            </button>

            <button
              onClick={() => {
                onTabChange("tools");
                onClearSelection();
              }}
              className={cn(
                "py-1.5 px-1 rounded-md text-center transition-all truncate text-[11px]",
                activeTab === "tools"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              Tools
            </button>

            <button
              onClick={() => {
                onTabChange("test");
                onClearSelection();
              }}
              className={cn(
                "py-1.5 px-1 rounded-md text-center transition-all truncate text-[11px]",
                activeTab === "test"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              Test agent
            </button>

            <button
              onClick={() => {
                onTabChange("validation");
                onClearSelection();
              }}
              className={cn(
                "py-1.5 px-1 rounded-md text-center transition-all truncate text-[11px] relative",
                activeTab === "validation"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <span>Validation</span>
              {validationResult && validationResult.findings.length > 0 && (
                <span className="ml-1 px-1 py-0.2 rounded-full text-[9px] bg-rose-500 text-white font-bold">
                  {validationResult.findings.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Tab / Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedNode && activeTab === "setup" ? (
          <NodeEditor
            nodeId={selectedNode.id}
            data={selectedNode.data}
            onUpdate={onUpdateNode}
            onDelete={onDeleteNode}
            onDuplicate={onDuplicateNode}
            onAddTransition={onAddTransition}
            onClose={onClearSelection}
            nodes={nodes}
            edges={edges}
            onFocusTarget={onFocusTarget}
          />
        ) : selectedNode && activeTab === "validation" ? (
          <ValidationTab
            status={validationState}
            result={validationResult}
            error={validationError}
            selectedFinding={selectedFinding}
            onSelectFinding={onSelectFinding}
            onRunValidation={onRunValidation}
            onCancelValidation={onCancelValidation}
            onDismissError={onDismissError}
            onFocusTarget={onFocusTarget}
            onLoadPresetGraph={onLoadPresetGraph}
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onClearSelection={onClearSelection}
          />
        ) : selectedEdge && activeTab !== "validation" && activeTab !== "test" && activeTab !== "tools" ? (
          <EdgeEditor
            edgeId={selectedEdge.id}
            sourceName={getSourceNodeName(selectedEdge)}
            targetName={getTargetNodeName(selectedEdge)}
            data={selectedEdge.data || { transitionType: "always" }}
            onUpdate={onUpdateEdge}
            onDelete={onDeleteEdge}
            onClose={onClearSelection}
          />
        ) : activeTab === "setup" ? (
          <AgentSetupTab
            selectedNode={selectedNode}
            onUpdateNode={onUpdateNode}
            nodes={nodes}
          />
        ) : activeTab === "tools" ? (
          <ToolsTab />
        ) : activeTab === "test" ? (
          <TestAgentTab />
        ) : (
          <ValidationTab
            status={validationState}
            result={validationResult}
            error={validationError}
            selectedFinding={selectedFinding}
            onSelectFinding={onSelectFinding}
            onRunValidation={onRunValidation}
            onCancelValidation={onCancelValidation}
            onDismissError={onDismissError}
            onFocusTarget={onFocusTarget}
            onLoadPresetGraph={onLoadPresetGraph}
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onClearSelection={onClearSelection}
          />
        )}
      </div>
    </aside>
  );
}
