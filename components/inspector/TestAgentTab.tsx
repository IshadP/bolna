"use client";

import React, { useState } from "react";
import {
  PhoneOutgoing,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Bot,
  User,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TestAgentTab() {
  const [testMode, setTestMode] = useState<"idle" | "call" | "chat">("idle");
  const [messages, setMessages] = useState<
    { role: "agent" | "user"; text: string; time: string }[]
  >([
    {
      role: "agent",
      text: "Hello! Thanks for calling Bolna Graph Agent. How can I help you today?",
      time: "10:30 AM",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    const newMsgs = [
      ...messages,
      { role: "user" as const, text: userText, time: "Now" },
    ];
    setMessages(newMsgs);
    setInputVal("");

    // Simulate Agent response based on graph
    setTimeout(() => {
      setMessages([
        ...newMsgs,
        {
          role: "agent",
          text: "I understand you need assistance with that. Let me look up your account details or route your request.",
          time: "Now",
        },
      ]);
    }, 900);
  };

  return (
    <div className="space-y-4 text-xs select-none">
      {testMode === "idle" && (
        <div className="space-y-3">
          {/* Primary Action Button */}
          <button
            onClick={() => setTestMode("call")}
            className="w-full h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <PhoneOutgoing className="w-4 h-4" />
            <span>Get call from agent</span>
          </button>

          {/* Divider 'or' */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
            <span className="text-[11px] text-slate-400 font-medium">or</span>
            <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Secondary Action Button */}
          <button
            onClick={() => setTestMode("chat")}
            className="w-full h-9 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-medium text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with agent</span>
          </button>

          <div className="mt-4 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400">
            <div className="text-[11px] leading-relaxed">
              Launch a live simulation to preview node transitions and dynamic voice turn latency.
            </div>
          </div>
        </div>
      )}

      {/* Simulated Live Call Mode */}
      {testMode === "call" && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-xs text-slate-200">
                Call in Progress (00:14)
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Latency: 420ms
            </span>
          </div>

          {/* Audio Waveform simulation */}
          <div className="flex items-center justify-center gap-1.5 h-12 bg-slate-950/60 rounded-lg p-2">
            {[20, 50, 80, 40, 90, 60, 30, 75, 45, 95, 70, 35, 60].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className="w-1 bg-blue-500 rounded-full transition-all duration-150"
              />
            ))}
          </div>

          <div className="text-[11px] text-slate-300 text-center italic">
            &quot;Hello! Thanks for calling Bolna Graph Agent. How can I help you today?&quot;
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={cn(
                "p-2.5 rounded-full transition-colors",
                isMuted ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              )}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setTestMode("idle")}
              className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}

      {/* Simulated Interactive Chat Mode */}
      {testMode === "chat" && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Interactive Chat Test
            </div>
            <button
              onClick={() => setTestMode("idle")}
              className="text-[11px] text-blue-600 hover:underline font-medium"
            >
              Back
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-56 overflow-y-auto space-y-2 p-1 pr-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2 max-w-[85%]",
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold",
                    m.role === "agent"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-slate-800 text-white"
                  )}
                >
                  {m.role === "agent" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={cn(
                    "p-2.5 rounded-xl text-xs leading-relaxed",
                    m.role === "agent"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                      : "bg-blue-600 text-white"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="flex gap-1.5 pt-1">
            <input
              type="text"
              placeholder="Type user utterance..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
