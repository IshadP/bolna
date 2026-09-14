import { Node, Edge } from "@xyflow/react";
import { CustomNodeData, CustomEdgeData } from "../types/graph";

/**
 * Computes a deterministic hash/fingerprint of the graph's SEMANTIC content.
 * Position, dragging, zoom, selection, and UI panels do NOT affect this fingerprint.
 */
export function computeSemanticFingerprint(
  nodes: Node<CustomNodeData>[],
  edges: Edge<CustomEdgeData>[]
): string {
  const nodeParts = nodes
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(
      (n) =>
        `${n.id}:${n.data?.type || ""}:${n.data?.name || ""}:${n.data?.description || ""}:${
          n.data?.instructions || ""
        }`
    );

  const edgeParts = edges
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(
      (e) =>
        `${e.id}:${e.source}->${e.target}:${e.data?.transitionType || "always"}:${
          e.data?.condition || ""
        }:${e.data?.label || ""}`
    );

  return `${nodeParts.join("|")}###${edgeParts.join("|")}`;
}
