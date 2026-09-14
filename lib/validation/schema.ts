/**
 * JSON Schema for OpenAI Structured Outputs (`response_format` / `json_schema`).
 * Strictly defines the structure of semantic validation output.
 */
export const VALIDATION_JSON_SCHEMA = {
  type: "object",
  properties: {
    summary: {
      type: "object",
      properties: {
        totalIssues: {
          type: "integer",
          description: "Total number of semantic issues identified.",
        },
        criticalIssues: {
          type: "integer",
          description: "Number of critical severity issues.",
        },
        warningIssues: {
          type: "integer",
          description: "Number of warning severity issues.",
        },
      },
      required: ["totalIssues", "criticalIssues", "warningIssues"],
      additionalProperties: false,
    },
    findings: {
      type: "array",
      description: "List of high-confidence semantic findings in the graph.",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique finding identifier (e.g. finding-1).",
          },
          category: {
            type: "string",
            enum: [
              "multiple_responsibilities",
              "contradictory_instructions",
              "ambiguous_transitions",
              "missing_semantic_path",
              "node_transition_mismatch",
            ],
            description: "One of the 5 allowed semantic issue categories.",
          },
          severity: {
            type: "string",
            enum: ["critical", "warning"],
            description: "Severity level of the finding.",
          },
          title: {
            type: "string",
            description: "Concise title of the finding.",
          },
          summary: {
            type: "string",
            description: "Single-sentence executive summary of the issue.",
          },
          explanation: {
            type: "string",
            description: "Detailed explanation of why this is a semantic problem in the conversational flow.",
          },
          primaryNodeId: {
            type: ["string", "null"],
            description: "ID of the primary affected node, or null if edge-only.",
          },
          primaryEdgeId: {
            type: ["string", "null"],
            description: "ID of the primary affected transition/edge, or null if node-only.",
          },
          relatedNodeIds: {
            type: "array",
            items: { type: "string" },
            description: "IDs of any other nodes involved in this issue.",
          },
          relatedEdgeIds: {
            type: "array",
            items: { type: "string" },
            description: "IDs of any other transitions/edges involved in this issue.",
          },
          evidence: {
            type: "array",
            description: "Concrete text excerpts and quotes from the graph supporting this finding.",
            items: {
              type: "object",
              properties: {
                sourceType: {
                  type: "string",
                  enum: ["node", "edge"],
                  description: "Whether the evidence was found in a node or transition.",
                },
                sourceId: {
                  type: "string",
                  description: "Exact ID of the node or edge providing this evidence.",
                },
                excerpt: {
                  type: "string",
                  description: "Direct quote or excerpt from the graph item.",
                },
              },
              required: ["sourceType", "sourceId", "excerpt"],
              additionalProperties: false,
            },
          },
        },
        required: [
          "id",
          "category",
          "severity",
          "title",
          "summary",
          "explanation",
          "primaryNodeId",
          "primaryEdgeId",
          "relatedNodeIds",
          "relatedEdgeIds",
          "evidence",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["summary", "findings"],
  additionalProperties: false,
} as const;
