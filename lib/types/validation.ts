export type ValidationSeverity = "critical" | "structural" | "warning";

export type ValidationCategory =
  | "multiple_responsibilities"
  | "contradictory_instructions"
  | "ambiguous_transitions"
  | "missing_semantic_path"
  | "node_transition_mismatch"
  | "structural_issue"
  | "unconnected_node"
  | "missing_prompt"
  | "infinite_loop";

export interface ValidationEvidence {
  sourceType: "node" | "edge";
  sourceId: string;
  excerpt: string;
}

export interface ValidationFinding {
  id: string;
  category: ValidationCategory;
  severity: ValidationSeverity;
  title: string;
  summary: string;
  explanation: string;
  primaryNodeId: string | null;
  primaryEdgeId: string | null;
  relatedNodeIds: string[];
  relatedEdgeIds: string[];
  evidence: ValidationEvidence[];
}

export interface ValidationSummary {
  totalIssues: number;
  criticalIssues: number;
  structuralIssues?: number;
  warningIssues: number;
}

export interface ValidationResponsePayload {
  summary: ValidationSummary;
  findings: ValidationFinding[];
}

export interface ValidationResult {
  timestamp: number;
  summary: ValidationSummary;
  findings: ValidationFinding[];
  semanticGraphFingerprint: string;
  modelUsed?: string;
}

export type ValidationState =
  | "never_validated"
  | "analyzing"
  | "validated"
  | "stale"
  | "error";

export interface ApiValidationError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiValidationResponse {
  success: boolean;
  validation?: ValidationResponsePayload;
  error?: ApiValidationError;
  model?: string;
}
