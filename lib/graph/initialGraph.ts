import { Node, Edge } from "@xyflow/react";
import { CustomNodeData, CustomEdgeData } from "../types/graph";

export const INITIAL_NODES: Node<CustomNodeData>[] = [
  {
    id: "greeting",
    type: "customNode",
    position: { x: 380, y: 160 },
    data: {
      label: "Start",
      name: "greeting",
      type: "start",
      description: "Greet the caller and ask how you can help them today.",
      instructions: "Greet the caller warmly with 'Hello, thanks for calling! How can I help you today?' and wait for their response.",
      transitionsCount: 0,
    },
  },
];

export const INITIAL_EDGES: Edge<CustomEdgeData>[] = [];
