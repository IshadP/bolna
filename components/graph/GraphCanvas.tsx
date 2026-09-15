"use client";

import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { CustomNode } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";
import { GraphToolbar } from "./GraphToolbar";
import { NodeSearchModal } from "./NodeSearchModal";
import { VariablesModal } from "./VariablesModal";
import { CustomNodeData, CustomEdgeData, NodeType } from "@/lib/types/graph";
import {
  ValidationFinding,
  ValidationResult,
  ValidationState,
  ApiValidationError,
  ApiValidationResponse,
} from "@/lib/types/validation";
import { normalizeGraphForValidation } from "@/lib/graph/normalize";
import { computeSemanticFingerprint } from "@/lib/graph/fingerprint";
import { INITIAL_NODES, INITIAL_EDGES } from "@/lib/graph/initialGraph";
import { PRESET_TEST_GRAPHS, PresetTestGraph } from "@/lib/graph/testGraphs";
import { SimulatedGraphsModal } from "./SimulatedGraphsModal";
import { PanelRight, Check, FlaskConical, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GraphCanvasProps {
  onSelectNode: (node: Node<CustomNodeData> | null) => void;
  onSelectEdge: (edge: Edge<CustomEdgeData> | null) => void;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  // Validation state shared with Inspector
  validationState: ValidationState;
  setValidationState: (state: ValidationState) => void;
  validationResult: ValidationResult | null;
  setValidationResult: (result: ValidationResult | null) => void;
  validationError: ApiValidationError | null;
  setValidationError: (err: ApiValidationError | null) => void;
  selectedFinding: ValidationFinding | null;
  setSelectedFinding: (finding: ValidationFinding | null) => void;
  onOpenValidationTab: () => void;
  onRegisterGraphRef?: (handlers: {
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
  }) => void;
}

function FlowInner({
  onSelectNode,
  onSelectEdge,
  selectedNodeId,
  selectedEdgeId,
  isInspectorOpen,
  onToggleInspector,
  validationState,
  setValidationState,
  validationResult,
  setValidationResult,
  validationError,
  setValidationError,
  selectedFinding,
  setSelectedFinding,
  onOpenValidationTab,
  onRegisterGraphRef,
}: GraphCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<CustomEdgeData>>(INITIAL_EDGES);

  // Modals & Popovers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVariablesOpen, setIsVariablesOpen] = useState(false);
  const [isSimulatedModalOpen, setIsSimulatedModalOpen] = useState(false);
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);

  const testDropdownRef = useRef<HTMLDivElement>(null);

  // Close test dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (testDropdownRef.current && !testDropdownRef.current.contains(e.target as globalThis.Node)) {
        setIsTestDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { zoomIn, zoomOut, fitView, setCenter } = useReactFlow();

  // Last validated semantic fingerprint
  const validatedFingerprintRef = useRef<string | null>(null);

  // Register custom node & edge types
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ customEdge: CustomEdge }), []);

  // Check if semantic graph changed -> Transition validation to "stale"
  useEffect(() => {
    if (validationState === "validated" && validatedFingerprintRef.current) {
      const currentFingerprint = computeSemanticFingerprint(nodes, edges);
      if (currentFingerprint !== validatedFingerprintRef.current) {
        setValidationState("stale");
      }
    }
  }, [nodes, edges, validationState, setValidationState]);

  // Abort controller ref for cancelling in-flight validation requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // REAL Validation Handler with AbortSignal support
  const handleRunValidation = useCallback(async () => {
    // Abort any existing pending request first
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setValidationState("analyzing");
    setValidationError(null);
    setSelectedFinding(null);

    const payload = normalizeGraphForValidation(nodes, edges);
    const currentFingerprint = computeSemanticFingerprint(nodes, edges);

    try {
      const res = await fetch("/api/validate-graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data: ApiValidationResponse = await res.json();

      if (data.success && data.validation) {
        const result: ValidationResult = {
          timestamp: Date.now(),
          summary: data.validation.summary,
          findings: data.validation.findings,
          semanticGraphFingerprint: currentFingerprint,
          modelUsed: data.model,
        };

        setValidationResult(result);
        validatedFingerprintRef.current = currentFingerprint;
        setValidationState("validated");
        onOpenValidationTab();
      } else {
        setValidationError(
          data.error || {
            code: "VALIDATION_FAILED",
            message: "Failed to validate graph with validator.",
          }
        );
        setValidationState("error");
        onOpenValidationTab();
      }
    } catch (networkErr: any) {
      if (networkErr.name === "AbortError") {
        console.log("[Validation cancelled by user]");
        setValidationState("never_validated");
        setValidationError(null);
        return;
      }
      console.error("[Validation Network Error]:", networkErr);
      setValidationError({
        code: "NETWORK_ERROR",
        message: networkErr.message || "Failed to connect to /api/validate-graph.",
      });
      setValidationState("error");
      onOpenValidationTab();
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [
    nodes,
    edges,
    setValidationState,
    setValidationError,
    setValidationResult,
    setSelectedFinding,
    onOpenValidationTab,
  ]);

  // Cancel in-flight validation
  const handleCancelValidation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setValidationState("never_validated");
  }, [setValidationState]);

  // Focus target on canvas (node or edge)
  const handleFocusTarget = useCallback(
    (targetId: string, targetType: "node" | "edge") => {
      if (targetType === "node") {
        const node = nodes.find(
          (n) => n.id === targetId || n.data?.name?.toLowerCase() === targetId.toLowerCase()
        );
        if (node) {
          setCenter(node.position.x + 140, node.position.y + 70, {
            zoom: 1.1,
            duration: 500,
          });
          onSelectNode(node);
          onSelectEdge(null);
        }
      } else {
        const edge = edges.find((e) => e.id === targetId);
        if (edge) {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          if (sourceNode && targetNode) {
            const midX = (sourceNode.position.x + targetNode.position.x) / 2 + 140;
            const midY = (sourceNode.position.y + targetNode.position.y) / 2 + 70;
            setCenter(midX, midY, { zoom: 1.1, duration: 500 });
          }
          onSelectEdge(edge);
          onSelectNode(null);
        }
      }
    },
    [nodes, edges, setCenter, onSelectNode, onSelectEdge]
  );

  // Load a preset test graph
  const handleLoadPresetGraph = useCallback(
    (preset: PresetTestGraph) => {
      setNodes(preset.nodes);
      setEdges(preset.edges);
      onSelectNode(null);
      onSelectEdge(null);
      setValidationState("never_validated");
      setValidationResult(null);
      setValidationError(null);
      validatedFingerprintRef.current = null;
      setTimeout(() => fitView({ duration: 500 }), 100);
    },
    [
      setNodes,
      setEdges,
      onSelectNode,
      onSelectEdge,
      setValidationState,
      setValidationResult,
      setValidationError,
      fitView,
    ]
  );

  // Expose node/edge mutating helpers to parent
  const handleUpdateNode = useCallback(
    (id: string, partial: Partial<CustomNodeData>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? {
                ...n,
                data: {
                  ...n.data,
                  ...partial,
                },
              }
            : n
        )
      );
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      onSelectNode(null);
    },
    [setNodes, setEdges, onSelectNode]
  );

  const handleUpdateEdge = useCallback(
    (id: string, partial: Partial<CustomEdgeData>) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === id
            ? {
                ...e,
                data: {
                  ...e.data,
                  transitionType: partial.transitionType || e.data?.transitionType || "always",
                  condition: partial.condition ?? e.data?.condition,
                  label: partial.label ?? e.data?.label,
                  hasValidationIssue: partial.hasValidationIssue ?? e.data?.hasValidationIssue,
                  validationIssueType: partial.validationIssueType ?? e.data?.validationIssueType,
                },
              }
            : e
        )
      );
    },
    [setEdges]
  );

  const handleDeleteEdge = useCallback(
    (id: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== id));
      onSelectEdge(null);
    },
    [setEdges, onSelectEdge]
  );

  const handleDuplicateNode = useCallback(
    (id: string) => {
      const target = nodes.find((n) => n.id === id);
      if (!target) return;
      const newId = `${target.data.name}_copy_${Date.now().toString().slice(-4)}`;
      const newNode: Node<CustomNodeData> = {
        id: newId,
        type: "customNode",
        position: {
          x: target.position.x + 50,
          y: target.position.y + 50,
        },
        data: {
          ...target.data,
          name: newId,
          label: target.data.label,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      onSelectNode(newNode);
    },
    [nodes, setNodes, onSelectNode]
  );

  const handleAddTransition = useCallback(
    (sourceId: string) => {
      // Find a suitable target node that isn't the source
      const otherNode = nodes.find((n) => n.id !== sourceId);
      if (!otherNode) return;
      const newEdgeId = `edge-${sourceId}-${otherNode.id}-${Date.now().toString().slice(-4)}`;
      const newEdge: Edge<CustomEdgeData> = {
        id: newEdgeId,
        source: sourceId,
        target: otherNode.id,
        type: "customEdge",
        data: {
          label: "Always",
          transitionType: "always",
        },
      };
      setEdges((eds) => [...eds, newEdge]);
      // Update transitionsCount on source node
      setNodes((nds) =>
        nds.map((n) =>
          n.id === sourceId
            ? {
                ...n,
                data: {
                  ...n.data,
                  transitionsCount: (n.data.transitionsCount || 0) + 1,
                },
              }
            : n
        )
      );
      onSelectEdge(newEdge);
      onSelectNode(null);
    },
    [nodes, setNodes, setEdges, onSelectEdge, onSelectNode]
  );

  // Register parent callbacks
  useEffect(() => {
    if (onRegisterGraphRef) {
      onRegisterGraphRef({
        updateNode: handleUpdateNode,
        deleteNode: handleDeleteNode,
        duplicateNode: handleDuplicateNode,
        addTransition: handleAddTransition,
        updateEdge: handleUpdateEdge,
        deleteEdge: handleDeleteEdge,
        focusTarget: handleFocusTarget,
        loadPresetGraph: handleLoadPresetGraph,
        cancelValidation: handleCancelValidation,
        runValidation: handleRunValidation,
        nodes,
        edges,
      });
    }
  }, [
    onRegisterGraphRef,
    handleUpdateNode,
    handleDeleteNode,
    handleDuplicateNode,
    handleAddTransition,
    handleUpdateEdge,
    handleDeleteEdge,
    handleFocusTarget,
    handleLoadPresetGraph,
    handleCancelValidation,
    handleRunValidation,
    nodes,
    edges,
  ]);

  // Add new node from toolbar
  const handleAddNode = useCallback(
    (type: NodeType) => {
      const id = `node_${Date.now().toString().slice(-4)}`;
      const titles: Record<NodeType, string> = {
        start: "welcome_prompt",
        closing: "end_call",
        conversation: "collect_info",
        router: "intent_classifier",
        function: "execute_tool",
      };

      const descriptions: Record<NodeType, string> = {
        start: "Initial greeting entry point",
        closing: "Graceful farewell and call termination",
        conversation: "Ask user for details and collect audio response",
        router: "Route conversation based on customer intent",
        function: "Trigger registered webhook or API action",
      };

      const x = 380 + Math.floor(Math.random() * 80) - 40;
      const y = 260 + Math.floor(Math.random() * 80) - 40;

      const newNode: Node<CustomNodeData> = {
        id,
        type: "customNode",
        position: { x, y },
        data: {
          label: type.toUpperCase(),
          name: titles[type] || "new_node",
          type,
          description: descriptions[type] || "New custom node",
          instructions: `Instructions for ${titles[type]}...`,
          transitionsCount: 0,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      onSelectNode(newNode);
      onSelectEdge(null);
    },
    [setNodes, onSelectNode, onSelectEdge]
  );

  // Connect handles
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge<CustomEdgeData> = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now().toString().slice(-4)}`,
        type: "customEdge",
        data: {
          label: "Always",
          transitionType: "always",
          condition: "Always",
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));

      // Update transition counts
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === params.source) {
            return {
              ...n,
              data: {
                ...n.data,
                transitionsCount: (n.data.transitionsCount || 0) + 1,
              },
            };
          }
          return n;
        })
      );
    },
    [setEdges, setNodes]
  );

  // Auto layout nodes in a hierarchical grid
  const handleAutoLayout = useCallback(() => {
    setNodes((nds) => {
      const startNodes = nds.filter((n) => n.data.type === "start");
      const otherNodes = nds.filter((n) => n.data.type !== "start" && n.data.type !== "closing");
      const closingNodes = nds.filter((n) => n.data.type === "closing");

      let currentY = 80;
      const updated: Node<CustomNodeData>[] = [];

      startNodes.forEach((n, idx) => {
        updated.push({
          ...n,
          position: { x: 380 + idx * 320, y: currentY },
        });
      });

      if (startNodes.length > 0) currentY += 200;

      otherNodes.forEach((n, idx) => {
        updated.push({
          ...n,
          position: { x: 260 + (idx % 3) * 320, y: currentY + Math.floor(idx / 3) * 180 },
        });
      });

      if (otherNodes.length > 0) currentY += Math.ceil(otherNodes.length / 3) * 180 + 40;

      closingNodes.forEach((n, idx) => {
        updated.push({
          ...n,
          position: { x: 380 + idx * 320, y: currentY },
        });
      });

      return updated;
    });

    setTimeout(() => fitView({ duration: 500 }), 50);
  }, [setNodes, fitView]);

  // Handle Save
  const handleSaveGraph = useCallback(() => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2000);
  }, []);

  // Map real validation findings onto node data so bottom error bars appear!
  const augmentedNodes = useMemo(() => {
    return nodes.map((node) => {
      // Only attach findings that strictly belong to this node (and are not edge-specific issues)
      const nodeFindings =
        validationResult?.findings.filter(
          (f) =>
            !f.primaryEdgeId &&
            (f.primaryNodeId === node.id ||
              (node.data.name && f.primaryNodeId?.toLowerCase() === node.data.name?.toLowerCase()))
        ) || [];

      return {
        ...node,
        selected: node.id === selectedNodeId,
        data: {
          ...node.data,
          findings: nodeFindings,
          onSelectFinding: (findingId: string) => {
            const f = validationResult?.findings.find((x) => x.id === findingId);
            if (f) {
              setSelectedFinding(f);
              onOpenValidationTab();
            }
          },
        },
      };
    });
  }, [nodes, selectedNodeId, validationResult, setSelectedFinding, onOpenValidationTab]);

  const augmentedEdges = useMemo(() => {
    return edges.map((edge) => {
      // Only attach findings that strictly belong to this transition/edge
      const edgeFindings =
        validationResult?.findings.filter((f) => f.primaryEdgeId === edge.id) || [];

      return {
        ...edge,
        selected: edge.id === selectedEdgeId,
        data: {
          ...edge.data,
          transitionType: edge.data?.transitionType || "always",
          findings: edgeFindings,
          onSelectFinding: (findingId: string) => {
            const f = validationResult?.findings.find((x) => x.id === findingId);
            if (f) {
              setSelectedFinding(f);
              onOpenValidationTab();
            }
          },
        },
      };
    });
  }, [edges, selectedEdgeId, validationResult, setSelectedFinding, onOpenValidationTab]);

  return (
    <div className="relative w-full h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* React Flow Canvas */}
      <ReactFlow
        nodes={augmentedNodes}
        edges={augmentedEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => {
          onSelectNode(node as Node<CustomNodeData>);
          onSelectEdge(null);
        }}
        onEdgeClick={(_, edge) => {
          onSelectEdge(edge as Edge<CustomEdgeData>);
          onSelectNode(null);
        }}
        onPaneClick={() => {
          onSelectNode(null);
          onSelectEdge(null);
          setSelectedFinding(null);
        }}
        defaultViewport={{ x: 120, y: 40, zoom: 0.95 }}
        minZoom={0.2}
        maxZoom={2}
        deleteKeyCode={["Backspace", "Delete"]}
      >
        {/* Subtle dotted background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#94a3b8"
          className="opacity-40 dark:opacity-20"
        />
      </ReactFlow>

      {/* Floating Canvas Toolbar & Test Graphs Preset (Top-Left) */}
      <div className="absolute top-4 left-5 z-20 flex items-center gap-2">
        <GraphToolbar
          onAddNode={handleAddNode}
          onAutoLayout={handleAutoLayout}
          onUndo={() => {}}
          onRedo={() => {}}
          canUndo={true}
          canRedo={true}
          onZoomIn={() => zoomIn({ duration: 300 })}
          onZoomOut={() => zoomOut({ duration: 300 })}
          onFitView={() => fitView({ duration: 500 })}
          onSearchOpen={() => setIsSearchOpen(true)}
          onVariablesOpen={() => setIsVariablesOpen(true)}
          onValidateGraph={handleRunValidation}
          onCancelValidation={handleCancelValidation}
          onSaveGraph={handleSaveGraph}
          onOpenSimulatedGraphs={() => setIsSimulatedModalOpen(true)}
          onLoadPresetGraph={handleLoadPresetGraph}
          validationState={validationState}
          criticalCount={validationResult?.summary.criticalIssues || 0}
          warningCount={validationResult?.summary.warningIssues || 0}
        />

        {/* Test Graphs Popover Menu (outside toolbar, right side, purple accent) */}
        <div className="relative" ref={testDropdownRef}>
          <button
            type="button"
            onClick={() => setIsTestDropdownOpen(!isTestDropdownOpen)}
            title="Browse & load test graph scenarios"
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-sm border border-purple-500/40 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/25 text-xs leading-4 font-semibold transition-all hover:shadow-lg active:scale-95 cursor-pointer select-none ring-1 ring-purple-400/30 hover:ring-purple-400/60"
          >
            <FlaskConical className="w-4 h-4 text-purple-200" />
            <span>Test Graphs</span>
            <ChevronDown className={cn("w-3.5 h-3.5 text-purple-200 transition-transform duration-200", isTestDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isTestDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
                style={{ transformOrigin: "top left" }}
                className="absolute left-0 top-full mt-2 w-72 max-h-[80vh] overflow-y-auto rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50 space-y-1 select-none"
              >
                {/* Header with Title & Showcase Notice */}
                <div className="px-2.5 pt-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <FlaskConical className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Load Validation Test Graphs</span>
                  </div>
                  <div className="mt-1.5 px-2 py-1 rounded-sm bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/60 flex items-center gap-1.5 text-[10px] text-purple-700 dark:text-purple-300">
                    <Sparkles className="w-3 h-3 shrink-0 text-purple-500" />
                    <span>This menu is for showcase purpose only</span>
                  </div>
                </div>

                {/* Preset List */}
                <div className="py-1 space-y-0.5">
                  {PRESET_TEST_GRAPHS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        handleLoadPresetGraph(preset);
                        setIsTestDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-sm hover:bg-purple-50/70 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
                    >
                      <div className="font-semibold text-xs leading-4 text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5 group-hover:text-slate-500 dark:group-hover:text-slate-400">
                        {preset.description}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Inspector Toggle Button (Top-Right) */}
      {!isInspectorOpen && (
        <div className="absolute top-4 right-5 z-20">
          <button
            type="button"
            onClick={onToggleInspector}
            className="flex items-center gap-1.5 px-3 h-9 rounded-sm border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-sm text-xs leading-4 font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 transition-colors backdrop-blur select-none cursor-pointer"
          >
            <PanelRight className="w-4 h-4 text-blue-600" />
            <span>Inspector</span>
          </button>
        </div>
      )}

      {/* Save Success Toast */}
      <AnimatePresence>
        {saveNotification && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium flex items-center gap-2 shadow-xl select-none"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Graph configuration saved successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <SimulatedGraphsModal
        isOpen={isSimulatedModalOpen}
        onClose={() => setIsSimulatedModalOpen(false)}
        onSelectPreset={handleLoadPresetGraph}
      />

      <NodeSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        nodes={nodes}
        onSelectNode={(nodeId) => {
          const target = nodes.find((n) => n.id === nodeId);
          if (target) {
            setCenter(target.position.x + 140, target.position.y + 70, {
              zoom: 1.1,
              duration: 500,
            });
            onSelectNode(target);
          }
        }}
      />

      <VariablesModal
        isOpen={isVariablesOpen}
        onClose={() => setIsVariablesOpen(false)}
      />
    </div>
  );
}

export function GraphCanvas(props: GraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowInner {...props} />
    </ReactFlowProvider>
  );
}
