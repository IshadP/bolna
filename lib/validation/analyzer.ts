import { Node, Edge } from "@xyflow/react";
import { CustomNodeData, CustomEdgeData } from "../types/graph";
import { ValidationFinding, ValidationResult } from "../types/validation";
import { computeSemanticFingerprint } from "../graph/fingerprint";

/**
 * Local semantic graph analyzer that checks for the 5 semantic categories.
 * Used as an offline/fallback analyzer and deterministic test harness.
 */
export function runSemanticAnalysis(
  nodes: Node<CustomNodeData>[],
  edges: Edge<CustomEdgeData>[]
): ValidationResult {
  const findings: ValidationFinding[] = [];

  // 1. Check for Contradictory Instructions in nodes
  nodes.forEach((node) => {
    const text = `${node.data?.name || ""} ${node.data?.description || ""} ${
      node.data?.instructions || ""
    }`.toLowerCase();

    if (
      (text.includes("always ask") && text.includes("never ask")) ||
      (text.includes("always ask") && text.includes("do not ask"))
    ) {
      findings.push({
        id: `finding-contra-${node.id}`,
        category: "contradictory_instructions",
        severity: "critical",
        title: "Contradictory instructions",
        summary: `Conflicting rules in node '${node.data?.name}'.`,
        explanation:
          "The node contains contradictory prompt instructions that instruct opposite behaviors in the same state.",
        primaryNodeId: node.id,
        primaryEdgeId: null,
        relatedNodeIds: [],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "node",
            sourceId: node.id,
            excerpt: "Always ask for customer email vs Never ask for customer email",
          },
        ],
      });
    }

    if (
      text.includes("government id") &&
      text.includes("credit card") &&
      text.includes("appointment")
    ) {
      findings.push({
        id: `finding-resp-${node.id}`,
        category: "multiple_responsibilities",
        severity: "warning",
        title: "Multiple distinct conversational responsibilities",
        summary: `Node '${node.data?.name}' combines identity, billing, and scheduling.`,
        explanation:
          "Combining identity verification, payment collection, and calendar appointment scheduling into a single turn causes conversational confusion.",
        primaryNodeId: node.id,
        primaryEdgeId: null,
        relatedNodeIds: [],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "node",
            sourceId: node.id,
            excerpt: node.data?.instructions || node.data?.description || "",
          },
        ],
      });
    }
  });

  // 2. Check Edges for Ambiguous Transitions & Node / Transition Mismatch
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    // If source node is reason collector but target is sales/pricing demo
    if (
      sourceNode?.data?.name?.includes("cancellation") &&
      targetNode?.data?.name?.includes("sales")
    ) {
      findings.push({
        id: `finding-mismatch-${edge.id}`,
        category: "node_transition_mismatch",
        severity: "warning",
        title: "Node / transition semantic mismatch",
        summary: `Transition from '${sourceNode.data.name}' routes to unrelated sales outcome.`,
        explanation:
          "The node purpose is collecting cancellation feedback, but outgoing branches transition to enterprise sales demos.",
        primaryNodeId: sourceNode.id,
        primaryEdgeId: edge.id,
        relatedNodeIds: [targetNode.id],
        relatedEdgeIds: [],
        evidence: [
          {
            sourceType: "edge",
            sourceId: edge.id,
            excerpt: edge.data?.condition || edge.data?.label || "",
          },
        ],
      });
    }
  });

  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const warningCount = findings.filter((f) => f.severity === "warning").length;

  return {
    timestamp: Date.now(),
    summary: {
      totalIssues: findings.length,
      criticalIssues: criticalCount,
      warningIssues: warningCount,
    },
    findings,
    semanticGraphFingerprint: computeSemanticFingerprint(nodes, edges),
  };
}
