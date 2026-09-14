"use client";

import React, { useState } from "react";
import {
  Copy,
  Plus,
  Trash2,
  MessageSquare,
  Volume2,
  GitBranch,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Check,
  Flag,
} from "lucide-react";
import { CustomNodeData, CustomEdgeData, NodeType } from "@/lib/types/graph";
import { Node, Edge } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface NodeEditorProps {
  nodeId: string;
  data: CustomNodeData;
  onUpdate: (id: string, partial: Partial<CustomNodeData>) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onAddTransition?: (sourceId: string) => void;
  onClose: () => void;
  nodes?: Node<CustomNodeData>[];
  edges?: Edge<CustomEdgeData>[];
  onFocusTarget?: (targetId: string, targetType: "node" | "edge") => void;
}

export function NodeEditor({
  nodeId,
  data,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddTransition,
  onClose,
  nodes = [],
  edges = [],
  onFocusTarget,
}: NodeEditorProps) {
  // Collapsible sections
  const [isLlmOverridesOpen, setIsLlmOverridesOpen] = useState(false);
  const [isRagOpen, setIsRagOpen] = useState(false);

  // Active language tab in Examples section ("Hindi" or "English")
  const [exampleLang, setExampleLang] = useState<"hindi" | "english">(
    data.examples?.selectedLanguage || "hindi"
  );

  // Find outgoing transitions from this node
  const outgoingEdges = edges.filter((e) => e.source === nodeId);

  // Determine if this is the start node
  const isStart = data.type === "start" || data.isStartNode === true;

  return (
    <div className="space-y-4 text-xs select-none animate-in fade-in duration-150 pb-8">
      {/* 1. Top Action Buttons Bar: [ Duplicate ] [ + Transition ] [ Delete ] */}
      <div className="flex items-center gap-2 pt-1 pb-1">
        {/* Duplicate Button */}
        <button
          type="button"
          onClick={() => onDuplicate && onDuplicate(nodeId)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
        >
          <Copy className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          <span>Duplicate</span>
        </button>

        {/* Transition Button */}
        <button
          type="button"
          onClick={() => onAddTransition && onAddTransition(nodeId)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          <span>Transition</span>
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(nodeId)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 font-medium transition-colors cursor-pointer ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>

      {/* 2. Node id */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Node id
        </label>
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) =>
            onUpdate(nodeId, {
              name: e.target.value.replace(/\s+/g, "_"),
            })
          }
          placeholder="node_id"
          className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-normal text-slate-800 dark:text-slate-100 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
        />
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          Letters, numbers and underscores only. Cannot start with a number. Spaces become underscores.
        </p>
      </div>

      {/* 3. Node type: [ LLM ] [ Static ] [ Router ] */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Node type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {/* LLM (Conversation / Start) */}
          <button
            type="button"
            onClick={() =>
              onUpdate(nodeId, {
                type: isStart ? "start" : "conversation",
                label: isStart ? "Start" : "Conversation",
              })
            }
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer",
              data.type === "conversation" || data.type === "start"
                ? "border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
            )}
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>LLM</span>
          </button>

          {/* Static (Closing / Function) */}
          <button
            type="button"
            onClick={() =>
              onUpdate(nodeId, {
                type: "closing",
                label: "Static",
              })
            }
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer",
              data.type === "closing" || data.type === "function"
                ? "border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
            )}
          >
            <Volume2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>Static</span>
          </button>

          {/* Router */}
          <button
            type="button"
            onClick={() =>
              onUpdate(nodeId, {
                type: "router",
                label: "Router",
              })
            }
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer",
              data.type === "router"
                ? "border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
            )}
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>Router</span>
          </button>
        </div>
      </div>

      {/* 4. Prompt */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Prompt
        </label>
        <textarea
          rows={5}
          value={data.instructions || data.description || ""}
          onChange={(e) =>
            onUpdate(nodeId, {
              instructions: e.target.value,
              description: e.target.value.slice(0, 100),
            })
          }
          placeholder="Greet the caller and ask how you can help them today."
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs leading-relaxed outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-y"
        />
      </div>

      {/* 5. Examples: [ Hindi ] [ English ] */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Examples
        </label>
        <div className="flex items-center gap-2">
          {/* Hindi Tab */}
          <button
            type="button"
            onClick={() => {
              setExampleLang("hindi");
              onUpdate(nodeId, {
                examples: {
                  ...data.examples,
                  selectedLanguage: "hindi",
                },
              });
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer",
              exampleLang === "hindi"
                ? "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            )}
          >
            Hindi
          </button>

          {/* English Tab */}
          <button
            type="button"
            onClick={() => {
              setExampleLang("english");
              onUpdate(nodeId, {
                examples: {
                  ...data.examples,
                  selectedLanguage: "english",
                },
              });
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer",
              exampleLang === "english"
                ? "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            )}
          >
            English
          </button>
        </div>

        {/* Example Input Box */}
        <div className="relative">
          <textarea
            rows={2}
            value={
              exampleLang === "hindi"
                ? data.examples?.hindiText || ""
                : data.examples?.englishText || ""
            }
            onChange={(e) => {
              const val = e.target.value;
              onUpdate(nodeId, {
                examples: {
                  ...data.examples,
                  selectedLanguage: exampleLang,
                  ...(exampleLang === "hindi"
                    ? { hindiText: val }
                    : { englishText: val }),
                },
              });
            }}
            placeholder="Enter example response..."
            className="w-full p-3 pr-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          />
          <span className="absolute right-3 top-3 text-[10px] text-slate-400 select-none">
            0 chars
          </span>
        </div>
      </div>

      {/* 6. Transitions */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Transitions
        </label>
        <div className="space-y-1.5">
          {outgoingEdges.length > 0 ? (
            outgoingEdges.map((edge) => {
              const targetNode = nodes.find((n) => n.id === edge.target);
              const targetName = targetNode?.data.name || edge.target;
              const cond = edge.data?.label || edge.data?.condition || "Always";
              return (
                <div
                  key={edge.id}
                  onClick={() => onFocusTarget && onFocusTarget(edge.id, "edge")}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer group"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0 group-hover:text-blue-600 transition-colors" />
                  <div>
                    <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                      {targetName}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                      {cond}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              onClick={() => onAddTransition && onAddTransition(nodeId)}
              className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <span className="text-[11px]">No transitions configured</span>
              <span className="text-[11px] font-semibold text-blue-600">+ Add</span>
            </div>
          )}
        </div>
      </div>

      {/* 7. Function call */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Function call
        </label>
        <div className="relative">
          <select
            value={data.functionCall || "No tool call"}
            onChange={(e) => onUpdate(nodeId, { functionCall: e.target.value })}
            className="w-full h-9 px-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 outline-none appearance-none cursor-pointer focus:border-blue-500"
          >
            <option value="No tool call">No tool call</option>
            <option value="check_availability">check_availability</option>
            <option value="book_appointment">book_appointment</option>
            <option value="fetch_user_profile">fetch_user_profile</option>
            <option value="process_refund">process_refund</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Add tools in the Tools tab to reference them here.
        </p>
      </div>

      {/* 8. Auto-replay on silence (in s) toggle */}
      <div className="flex items-center justify-between pt-1">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
          Auto-replay on silence (in s)
        </label>
        <button
          type="button"
          onClick={() =>
            onUpdate(nodeId, {
              autoReplayOnSilence: !data.autoReplayOnSilence,
            })
          }
          className={cn(
            "w-9 h-5 rounded-full transition-colors relative cursor-pointer p-0.5",
            data.autoReplayOnSilence
              ? "bg-blue-600"
              : "bg-slate-200 dark:bg-slate-700"
          )}
        >
          <div
            className={cn(
              "w-4 h-4 rounded-full bg-white transition-transform shadow-xs",
              data.autoReplayOnSilence ? "translate-x-4" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {/* 9. LLM overrides (Accordion) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsLlmOverridesOpen(!isLlmOverridesOpen)}
          className="w-full flex items-center justify-between py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer group"
        >
          <span className="underline group-hover:text-blue-600 transition-colors">
            LLM overrides
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-slate-400 transition-transform duration-200",
              isLlmOverridesOpen && "rotate-180"
            )}
          />
        </button>

        {isLlmOverridesOpen && (
          <div className="pt-3 pb-1 space-y-3 animate-in fade-in duration-150">
            {/* Reasoning effort */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Reasoning effort
              </label>
              <div className="relative">
                <select
                  value={data.llmOverrides?.reasoningEffort || "Inherit from agent"}
                  onChange={(e) =>
                    onUpdate(nodeId, {
                      llmOverrides: {
                        ...data.llmOverrides,
                        reasoningEffort: e.target.value,
                      },
                    })
                  }
                  className="w-full h-8 px-2.5 pr-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-200 outline-none appearance-none cursor-pointer"
                >
                  <option value="Inherit from agent">Inherit from agent</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Model & provider */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Model & provider
              </label>
              <div className="relative">
                <select
                  value={data.llmOverrides?.modelProvider || "Inherit from agent"}
                  onChange={(e) =>
                    onUpdate(nodeId, {
                      llmOverrides: {
                        ...data.llmOverrides,
                        modelProvider: e.target.value,
                      },
                    })
                  }
                  className="w-full h-8 px-2.5 pr-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-200 outline-none appearance-none cursor-pointer"
                >
                  <option value="Inherit from agent">Inherit from agent</option>
                  <option value="openai">OpenAI</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="anthropic">Anthropic</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Select model */}
              <div className="relative">
                <select
                  value={data.llmOverrides?.modelName || ""}
                  onChange={(e) =>
                    onUpdate(nodeId, {
                      llmOverrides: {
                        ...data.llmOverrides,
                        modelName: e.target.value,
                      },
                    })
                  }
                  className="w-full h-8 px-2.5 pr-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select model</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="nemotron-3-ultra">Nemotron-3-Ultra</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Temperature
              </label>
              <input
                type="text"
                value={data.llmOverrides?.temperature || "Inherit"}
                onChange={(e) =>
                  onUpdate(nodeId, {
                    llmOverrides: {
                      ...data.llmOverrides,
                      temperature: e.target.value,
                    },
                  })
                }
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 outline-none"
              />
            </div>

            {/* Max tokens */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Max tokens
              </label>
              <input
                type="text"
                value={data.llmOverrides?.maxTokens || "Inherit"}
                onChange={(e) =>
                  onUpdate(nodeId, {
                    llmOverrides: {
                      ...data.llmOverrides,
                      maxTokens: e.target.value,
                    },
                  })
                }
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 10. Knowledge base (RAG) (Accordion) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsRagOpen(!isRagOpen)}
          className="w-full flex items-center justify-between py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer group"
        >
          <span className="underline group-hover:text-blue-600 transition-colors">
            Knowledge base (RAG)
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-slate-400 transition-transform duration-200",
              isRagOpen && "rotate-180"
            )}
          />
        </button>

        {isRagOpen && (
          <div className="pt-3 pb-1 space-y-1 animate-in fade-in duration-150">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Knowledge base (multi-select)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Select knowledge bases"
                readOnly
                className="w-full h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-500 cursor-pointer outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 11. Set as start node */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Set as start node
        </label>
        {isStart ? (
          <div className="w-full py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium text-center text-xs">
            Current start node
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              onUpdate(nodeId, {
                type: "start",
                label: "Start",
                isStartNode: true,
              })
            }
            className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-center text-xs transition-colors cursor-pointer"
          >
            Make this the start node
          </button>
        )}
      </div>
    </div>
  );
}
