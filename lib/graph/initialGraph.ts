import { Node, Edge } from "@xyflow/react";
import { CustomNodeData, CustomEdgeData } from "../types/graph";

export const INITIAL_NODES: Node<CustomNodeData>[] = [
  {
    id: "greeting",
    type: "customNode",
    position: { x: 380, y: 120 },
    data: {
      label: "Start",
      name: "greeting",
      type: "start",
      description: "Greet the caller and ask how you can help them today.",
      instructions: "Greet the caller warmly with 'Hello, thanks for calling! How can I help you today?' and wait for their response.",
      transitionsCount: 1,
    },
  },
  {
    id: "node",
    type: "customNode",
    position: { x: 380, y: 440 },
    data: {
      label: "Closing",
      name: "node",
      type: "closing",
      description: "End call with thtnak yout",
      instructions: "End call with thtnak yout. Thank them for their time and gracefully hang up.",
      transitionsCount: 0,
    },
  },
];

export const INITIAL_EDGES: Edge<CustomEdgeData>[] = [
  {
    id: "edge-greeting-node",
    source: "greeting",
    target: "node",
    type: "customEdge",
    data: {
      label: "Always",
      transitionType: "always",
      condition: "Always",
    },
  },
];
