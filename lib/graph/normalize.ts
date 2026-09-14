import { Node, Edge } from "@xyflow/react";
import { CustomNodeData, CustomEdgeData } from "../types/graph";

export interface NormalizedSemanticNode {
  id: string;
  name: string;
  type: string;
  purpose: string;
  instructions: string;
}

export interface NormalizedSemanticTransition {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: string;
  label: string;
  condition: string | null;
}

export interface NormalizedSemanticGraph {
  id: string;
  name: string;
  startNodeId: string | null;
  nodes: NormalizedSemanticNode[];
  transitions: NormalizedSemanticTransition[];
}

/**
 * Normalizes React Flow graph state into a clean semantic graph payload for the AI validator.
 * Strips UI coordinates, dragging state, and viewport data while strictly preserving node and edge IDs.
 */
export function normalizeGraphForValidation(
  nodes: Node<CustomNodeData>[],
  edges: Edge<CustomEdgeData>[],
  metadata?: { id?: string; name?: string }
): { graph: NormalizedSemanticGraph } {
  const startNode = nodes.find((n) => n.data?.type === "start");

  const normalizedNodes: NormalizedSemanticNode[] = nodes.map((node) => ({
    id: node.id,
    name: node.data?.name || node.id,
    type: node.data?.type || "conversation",
    purpose: node.data?.description || "",
    instructions: node.data?.instructions || node.data?.description || "",
  }));

  const normalizedTransitions: NormalizedSemanticTransition[] = edges.map((edge) => ({
    id: edge.id,
    sourceNodeId: edge.source,
    targetNodeId: edge.target,
    type: edge.data?.transitionType || "always",
    label: edge.data?.label || (edge.data?.transitionType === "always" ? "Always" : "Condition"),
    condition:
      edge.data?.transitionType === "condition"
        ? edge.data?.condition || edge.data?.label || null
        : null,
  }));

  return {
    graph: {
      id: metadata?.id || "graph-agent-1",
      name: metadata?.name || "New Graph Agent",
      startNodeId: startNode?.id || (nodes.length > 0 ? nodes[0].id : null),
      nodes: normalizedNodes,
      transitions: normalizedTransitions,
    },
  };
}
