export type NodeType = "start" | "closing" | "conversation" | "router" | "function";

export type TransitionType = "always" | "condition";

export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  name: string;
  type: NodeType;
  description: string;
  instructions?: string;
  transitionsCount?: number;
  hasErrors?: boolean;
  validationIssueCount?: number;
  validationIssues?: string[];
  parameters?: string[];
  routerConditions?: string[];
  // Extended node configuration fields matching Bolna UI
  examples?: {
    selectedLanguage?: "hindi" | "english";
    hindiText?: string;
    englishText?: string;
  };
  functionCall?: string;
  autoReplayOnSilence?: boolean;
  autoReplayDuration?: number;
  llmOverrides?: {
    reasoningEffort?: string;
    modelProvider?: string;
    modelName?: string;
    temperature?: string;
    maxTokens?: string;
  };
  knowledgeBases?: string[];
  isStartNode?: boolean;
}

export interface CustomEdgeData extends Record<string, unknown> {
  label?: string;
  transitionType: TransitionType;
  condition?: string;
  hasValidationIssue?: boolean;
  validationIssueType?: string;
}
