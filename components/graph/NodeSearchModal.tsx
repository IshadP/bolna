"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Flag, PhoneOff, MessageSquare, GitBranch, Wrench } from "lucide-react";
import { Node } from "@xyflow/react";
import { CustomNodeData, NodeType } from "@/lib/types/graph";
import { cn } from "@/lib/utils";

interface NodeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node<CustomNodeData>[];
  onSelectNode: (nodeId: string) => void;
}

export function NodeSearchModal({
  isOpen,
  onClose,
  nodes,
  onSelectNode,
}: NodeSearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = nodes.filter((n) => {
    const text = `${n.data.name} ${n.data.type} ${n.data.description || ""} ${n.data.instructions || ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case "start":
        return <Flag className="w-3.5 h-3.5 text-purple-600" />;
      case "closing":
        return <PhoneOff className="w-3.5 h-3.5 text-rose-600" />;
      case "router":
        return <GitBranch className="w-3.5 h-3.5 text-amber-600" />;
      case "function":
        return <Wrench className="w-3.5 h-3.5 text-emerald-600" />;
      case "conversation":
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-start justify-center pt-24 select-none animate-in fade-in duration-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nodes by title, type, or prompt..."
            autoFocus
            className="w-full h-11 px-3 bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((node) => (
              <button
                key={node.id}
                onClick={() => {
                  onSelectNode(node.id);
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {getNodeIcon(node.data.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                      {node.data.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {node.data.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {node.data.description || "No description"}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              No nodes matching &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
