"use client";

import React, { useState, useRef, useCallback } from "react";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import {
  InspectorPanel,
  InspectorTabType,
} from "@/components/inspector/InspectorPanel";
import { Node, Edge } from "@xyflow/react";
import { CustomNodeData, CustomEdgeData } from "@/lib/types/graph";
import {
  ValidationFinding,
  ValidationResult,
  ValidationState,
  ApiValidationError,
} from "@/lib/types/validation";
import { PresetTestGraph } from "@/lib/graph/testGraphs";

export default function BolnaGraphAgentApp() {
  // Navigation
  const [activeSidebarNav, setActiveSidebarNav] = useState("Graph Agent");
  const [agentName, setAgentName] = useState("New Graph Agent");

  // Selection state
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge<CustomEdgeData> | null>(null);

  // Inspector state
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [inspectorTab, setInspectorTab] = useState<InspectorTabType>("test");

  // Semantic Validation State
  const [validationState, setValidationState] = useState<ValidationState>("never_validated");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validationError, setValidationError] = useState<ApiValidationError | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<ValidationFinding | null>(null);
  const [highlightExcerpt, setHighlightExcerpt] = useState<string | null>(null);

  // Reference to graph actions (update, delete, duplicate, add transition, focus target, load preset, etc.)
  const graphActionsRef = useRef<{
    updateNode: (id: string, partial: Partial<CustomNodeData>) => void;
    deleteNode: (id: string) => void;
    duplicateNode?: (id: string) => void;
    addTransition?: (sourceId: string) => void;
    updateEdge: (id: string, partial: Partial<CustomEdgeData>) => void;
    deleteEdge: (id: string) => void;
    focusTarget: (targetId: string, targetType: "node" | "edge") => void;
    loadPresetGraph: (preset: PresetTestGraph) => void;
    cancelValidation?: () => void;
    runValidation?: () => void;
    nodes: Node<CustomNodeData>[];
    edges?: Edge<CustomEdgeData>[];
  } | null>(null);

  const [currentNodes, setCurrentNodes] = useState<Node<CustomNodeData>[]>([]);
  const [currentEdges, setCurrentEdges] = useState<Edge<CustomEdgeData>[]>([]);

  const handleRegisterGraphRef = useCallback(
    (handlers: {
      updateNode: (id: string, partial: Partial<CustomNodeData>) => void;
      deleteNode: (id: string) => void;
      duplicateNode?: (id: string) => void;
      addTransition?: (sourceId: string) => void;
      updateEdge: (id: string, partial: Partial<CustomEdgeData>) => void;
      deleteEdge: (id: string) => void;
      focusTarget: (targetId: string, targetType: "node" | "edge") => void;
      loadPresetGraph: (preset: PresetTestGraph) => void;
      cancelValidation?: () => void;
      runValidation?: () => void;
      nodes: Node<CustomNodeData>[];
      edges?: Edge<CustomEdgeData>[];
    }) => {
      graphActionsRef.current = handlers;
      setCurrentNodes(handlers.nodes);
      if (handlers.edges) setCurrentEdges(handlers.edges);
    },
    []
  );

  const handleSelectNode = (node: Node<CustomNodeData> | null) => {
    setSelectedNode(node);
    if (node) {
      setSelectedEdge(null);
      // If validation tab is active, stay on validation tab so user sees filtered findings for this node!
      // Otherwise default to setup
      setInspectorTab((prev) => (prev === "validation" ? "validation" : "setup"));
      setIsInspectorOpen(true);
    }
  };

  const handleSelectEdge = (edge: Edge<CustomEdgeData> | null) => {
    setSelectedEdge(edge);
    if (edge) {
      setSelectedNode(null);
      setInspectorTab((prev) => (prev === "validation" ? "validation" : "setup"));
      setIsInspectorOpen(true);
    }
  };

  const handleClearSelection = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
    setHighlightExcerpt(null);
  };

  const handleLocateInPrompt = (nodeId: string, excerpt?: string) => {
    // 1. Focus the node on canvas
    if (graphActionsRef.current) {
      graphActionsRef.current.focusTarget(nodeId, "node");
    }

    // 2. Find and select the node
    const targetNode = currentNodes.find(
      (n) => n.id === nodeId || n.data?.name?.toLowerCase() === nodeId.toLowerCase()
    );

    if (targetNode) {
      setSelectedNode(targetNode);
      setSelectedEdge(null);
    }

    // 3. Set the excerpt to highlight and switch to setup tab
    if (excerpt) {
      setHighlightExcerpt(excerpt);
    }
    setInspectorTab("setup");
    setIsInspectorOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* 1. Global Announcement Banner */}
      <AnnouncementBanner />

      {/* 2. Main Workspace Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <LeftSidebar
          activeTab={activeSidebarNav}
          onTabChange={(tab) => setActiveSidebarNav(tab)}
        />

        {/* Central Workspace Area */}
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          {/* Main App Header */}
          <AppHeader
            agentName={agentName}
            onRename={(newName) => setAgentName(newName)}
          />

          {/* Graph Canvas & Right Inspector */}
          <div className="flex flex-1 min-h-0 overflow-hidden relative">
            {/* Graph Canvas */}
            <div className="flex-1 h-full min-w-0 relative">
              <GraphCanvas
                onSelectNode={handleSelectNode}
                onSelectEdge={handleSelectEdge}
                selectedNodeId={selectedNode?.id || null}
                selectedEdgeId={selectedEdge?.id || null}
                isInspectorOpen={isInspectorOpen}
                onToggleInspector={() => setIsInspectorOpen(true)}
                validationState={validationState}
                setValidationState={setValidationState}
                validationResult={validationResult}
                setValidationResult={setValidationResult}
                validationError={validationError}
                setValidationError={setValidationError}
                selectedFinding={selectedFinding}
                setSelectedFinding={setSelectedFinding}
                onOpenValidationTab={() => {
                  setInspectorTab("validation");
                  setIsInspectorOpen(true);
                }}
                onRegisterGraphRef={handleRegisterGraphRef}
              />
            </div>

            {/* Right Inspector Panel */}
            <InspectorPanel
              isOpen={isInspectorOpen}
              onClose={() => setIsInspectorOpen(false)}
              activeTab={inspectorTab}
              onTabChange={(tab) => setInspectorTab(tab)}
              selectedNode={selectedNode}
              selectedEdge={selectedEdge}
              onUpdateNode={(id, partial) => {
                if (graphActionsRef.current) {
                  graphActionsRef.current.updateNode(id, partial);
                  if (selectedNode && selectedNode.id === id) {
                    setSelectedNode({
                      ...selectedNode,
                      data: {
                        ...selectedNode.data,
                        ...partial,
                      },
                    });
                  }
                }
              }}
              onDeleteNode={(id) => {
                if (graphActionsRef.current) {
                  graphActionsRef.current.deleteNode(id);
                }
                setSelectedNode(null);
              }}
              onUpdateEdge={(id, partial) => {
                if (graphActionsRef.current) {
                  graphActionsRef.current.updateEdge(id, partial);
                  if (selectedEdge && selectedEdge.id === id) {
                    setSelectedEdge({
                      ...selectedEdge,
                      data: {
                        ...selectedEdge.data,
                        ...partial,
                        transitionType: partial.transitionType || selectedEdge.data?.transitionType || "always",
                      },
                    });
                  }
                }
              }}
              onDeleteEdge={(id) => {
                if (graphActionsRef.current) {
                  graphActionsRef.current.deleteEdge(id);
                }
                setSelectedEdge(null);
              }}
              onClearSelection={handleClearSelection}
              validationState={validationState}
              validationResult={validationResult}
              validationError={validationError}
              selectedFinding={selectedFinding}
              onSelectFinding={setSelectedFinding}
              onRunValidation={() => {
                if (graphActionsRef.current?.runValidation) {
                  graphActionsRef.current.runValidation();
                }
              }}
              onCancelValidation={() => {
                if (graphActionsRef.current?.cancelValidation) {
                  graphActionsRef.current.cancelValidation();
                }
              }}
              onDismissError={() => {
                setValidationError(null);
                setValidationState(validationResult ? "validated" : "never_validated");
              }}
              onFocusTarget={(targetId, targetType) => {
                if (graphActionsRef.current) {
                  graphActionsRef.current.focusTarget(targetId, targetType);
                }
              }}
              onLocateInPrompt={handleLocateInPrompt}
              highlightExcerpt={highlightExcerpt}
              onClearHighlight={() => setHighlightExcerpt(null)}
              onLoadPresetGraph={(preset) => {
                if (graphActionsRef.current) {
                  graphActionsRef.current.loadPresetGraph(preset);
                }
              }}
              onDuplicateNode={(id) => {
                if (graphActionsRef.current?.duplicateNode) {
                  graphActionsRef.current.duplicateNode(id);
                }
              }}
              onAddTransition={(sourceId) => {
                if (graphActionsRef.current?.addTransition) {
                  graphActionsRef.current.addTransition(sourceId);
                }
              }}
              nodes={currentNodes}
              edges={currentEdges}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
