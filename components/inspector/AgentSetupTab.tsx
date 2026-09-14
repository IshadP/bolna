"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Info,
  Plus,
  X,
  Sliders,
  Check,
} from "lucide-react";
import { Node } from "@xyflow/react";
import { CustomNodeData } from "@/lib/types/graph";
import { cn } from "@/lib/utils";

interface AgentSetupTabProps {
  selectedNode?: Node<CustomNodeData> | null;
  nodes?: Node<CustomNodeData>[];
  onUpdateNode?: (id: string, partial: Partial<CustomNodeData>) => void;
  agentName?: string;
  onRenameAgent?: (name: string) => void;
}

export function AgentSetupTab({
  selectedNode,
  nodes = [],
  onUpdateNode,
  agentName = "New Graph Agent",
  onRenameAgent,
}: AgentSetupTabProps) {
  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basics: true,
    voice: false,
    llm: false,
    conversation: false,
    kb: false,
    json: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Section 1: Agent Basics
  const [currentAgentName, setCurrentAgentName] = useState(agentName);
  const [startNodeId, setStartNodeId] = useState("greeting");
  const [welcomeMessage, setWelcomeMessage] = useState("Hello from Bolna");
  const [globalPrompt, setGlobalPrompt] = useState(
    "You are a helpful agent. You will help the customer with their queries and doubts. You will never speak more than 2 sentences. Keep your responses concise"
  );

  // Section 2: Languages and Voice
  const [languages, setLanguages] = useState(["Hindi (Default)"]);
  const [sttProvider, setSttProvider] = useState("deepgram");
  const [sttModel, setSttModel] = useState("nova-3");
  const [sttKeywords, setSttKeywords] = useState("Deepgram, account number");
  const [bufferSize, setBufferSize] = useState(220);
  const [speedRate, setSpeedRate] = useState(1);
  const [similarityBoost, setSimilarityBoost] = useState(0.6);
  const [stability, setStability] = useState(0.5);
  const [styleExaggeration, setStyleExaggeration] = useState(0);

  // Section 3: LLM
  const [llmProvider, setLlmProvider] = useState("azure");
  const [llmModel, setLlmModel] = useState("gpt-4.1-mini cluster");
  const [routingProvider, setRoutingProvider] = useState("azure");
  const [routingModel, setRoutingModel] = useState("gpt-4.1-mini cluster");
  const [routingInstructions, setRoutingInstructions] = useState(
    "Start with the greeting node, gather context, and follow the graph transitions that match the conversation state."
  );
  const [routingMaxTokens, setRoutingMaxTokens] = useState(250);
  const [routingReasoning, setRoutingReasoning] = useState("Default (minimal)");

  // Section 4: Conversation Settings
  const [ignoreSpeechBeforeWelcome, setIgnoreSpeechBeforeWelcome] = useState(false);
  const [welcomeDelay, setWelcomeDelay] = useState(0);
  const [hangupSilenceEnabled, setHangupSilenceEnabled] = useState(true);
  const [hangupSilenceSeconds, setHangupSilenceSeconds] = useState(15);
  const [maxCallDurationEnabled, setMaxCallDurationEnabled] = useState(true);
  const [maxCallDurationSeconds, setMaxCallDurationSeconds] = useState(300);
  const [wordsBeforeInterruption, setWordsBeforeInterruption] = useState(2);
  const [checkUserOnlineEnabled, setCheckUserOnlineEnabled] = useState(true);
  const [checkUserOnlineSeconds, setCheckUserOnlineSeconds] = useState(10);
  const [checkMessageLang, setCheckMessageLang] = useState<"Hindi" | "English">("Hindi");
  const [checkMessageText, setCheckMessageText] = useState("Hello, क्या आप अभी भी लाइन पर हैं?");
  const [voicemailDetection, setVoicemailDetection] = useState(false);
  const [agentInitiatedHangup, setAgentInitiatedHangup] = useState(false);

  // Section 5: Knowledge Base
  const [selectedKb, setSelectedKb] = useState("");

  const startNodes = nodes.filter((n) => n.data.type === "start");

  return (
    <div className="space-y-1 text-xs select-none pb-8 text-slate-800 dark:text-slate-200">
      {/* 1. AGENT BASICS */}
      <div className="border-b border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => toggleSection("basics")}
          className="w-full flex items-center justify-between py-2.5 px-1 font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors text-xs"
        >
          <span>Agent Basics</span>
          {openSections.basics ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.basics && (
          <div className="space-y-3 pb-4 px-1 pt-1 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Agent name
                </label>
                <input
                  type="text"
                  value={currentAgentName}
                  onChange={(e) => {
                    setCurrentAgentName(e.target.value);
                    if (onRenameAgent) onRenameAgent(e.target.value);
                  }}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Start node
                </label>
                <select
                  value={startNodeId}
                  onChange={(e) => setStartNodeId(e.target.value)}
                  className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
                >
                  {startNodes.length > 0 ? (
                    startNodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.data.name}
                      </option>
                    ))
                  ) : (
                    <option value="greeting">greeting</option>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Welcome message
              </label>
              <textarea
                rows={3}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs leading-relaxed outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Global prompt
              </label>
              <textarea
                rows={4}
                value={globalPrompt}
                onChange={(e) => setGlobalPrompt(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs leading-relaxed outline-none focus:border-blue-500 font-sans"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. LANGUAGES AND VOICE */}
      <div className="border-b border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => toggleSection("voice")}
          className="w-full flex items-center justify-between py-2.5 px-1 font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors text-xs"
        >
          <span>Languages and Voice</span>
          {openSections.voice ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.voice && (
          <div className="space-y-3.5 pb-4 px-1 pt-1 animate-in fade-in duration-150">
            {/* Language badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {languages.map((lang, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                >
                  <span>{lang}</span>
                  <button
                    type="button"
                    onClick={() => setLanguages(languages.filter((_, idx) => idx !== i))}
                    className="hover:opacity-75"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setLanguages([...languages, "English (US)"])}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-medium transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Language</span>
              </button>
            </div>

            {/* Speech-to-Text */}
            <div className="space-y-2 pt-1">
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                Speech-to-Text
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Provider
                  </label>
                  <select
                    value={sttProvider}
                    onChange={(e) => setSttProvider(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
                  >
                    <option value="deepgram">deepgram</option>
                    <option value="openai">openai</option>
                    <option value="azure">azure</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Model
                  </label>
                  <select
                    value={sttModel}
                    onChange={(e) => setSttModel(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
                  >
                    <option value="nova-3">nova-3</option>
                    <option value="nova-2">nova-2</option>
                    <option value="whisper-1">whisper-1</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Keywords
                </label>
                <input
                  type="text"
                  value={sttKeywords}
                  onChange={(e) => setSttKeywords(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Text-to-Speech */}
            <div className="space-y-2.5 pt-1">
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                Text-to-Speech
              </div>
              <div className="text-[11px] text-slate-500 italic">
                No providers available for this language
              </div>

              {/* Sliders with value input */}
              <SliderRow
                label="Buffer Size"
                hasInfo
                value={bufferSize}
                min={50}
                max={500}
                step={10}
                onChange={setBufferSize}
              />
              <SliderRow
                label="Speed rate"
                hasInfo
                value={speedRate}
                min={0.5}
                max={2.0}
                step={0.1}
                onChange={setSpeedRate}
              />
              <SliderRow
                label="Similarity Boost"
                hasInfo
                value={similarityBoost}
                min={0}
                max={1}
                step={0.05}
                onChange={setSimilarityBoost}
              />
              <SliderRow
                label="Stability"
                hasInfo
                value={stability}
                min={0}
                max={1}
                step={0.05}
                onChange={setStability}
              />
              <SliderRow
                label="Style Exaggeration"
                hasInfo
                value={styleExaggeration}
                min={0}
                max={1}
                step={0.05}
                onChange={setStyleExaggeration}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. LLM */}
      <div className="border-b border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => toggleSection("llm")}
          className="w-full flex items-center justify-between py-2.5 px-1 font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors text-xs"
        >
          <span>LLM</span>
          {openSections.llm ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.llm && (
          <div className="space-y-3 pb-4 px-1 pt-1 animate-in fade-in duration-150">
            {/* Model & provider */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Model & provider
              </label>
              <select
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value)}
                className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
              >
                <option value="azure">azure</option>
                <option value="openai">openai</option>
                <option value="anthropic">anthropic</option>
                <option value="groq">groq</option>
              </select>
              <select
                value={llmModel}
                onChange={(e) => setLlmModel(e.target.value)}
                className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
              >
                <option value="gpt-4.1-mini cluster">gpt-4.1-mini cluster</option>
                <option value="gpt-4o">gpt-4o</option>
                <option value="claude-3.5-sonnet">claude-3.5-sonnet</option>
              </select>
            </div>

            {/* Routing model & provider */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Routing model & provider
              </label>
              <select
                value={routingProvider}
                onChange={(e) => setRoutingProvider(e.target.value)}
                className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
              >
                <option value="azure">azure</option>
                <option value="openai">openai</option>
              </select>
              <select
                value={routingModel}
                onChange={(e) => setRoutingModel(e.target.value)}
                className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
              >
                <option value="gpt-4.1-mini cluster">gpt-4.1-mini cluster</option>
                <option value="gpt-4o-mini">gpt-4o-mini</option>
              </select>
            </div>

            {/* Routing instructions */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Routing instructions
              </label>
              <textarea
                rows={3}
                value={routingInstructions}
                onChange={(e) => setRoutingInstructions(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs leading-relaxed outline-none focus:border-blue-500 font-sans"
              />
            </div>

            {/* Routing max tokens & reasoning effort */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Routing max tokens
                </label>
                <input
                  type="number"
                  value={routingMaxTokens}
                  onChange={(e) => setRoutingMaxTokens(parseInt(e.target.value) || 0)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Routing reasoning effort
                </label>
                <select
                  value={routingReasoning}
                  onChange={(e) => setRoutingReasoning(e.target.value)}
                  className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
                >
                  <option value="Default (minimal)">Default (minimal)</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="text-[10px] text-slate-400">
                  GPT-5 routing models only.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. CONVERSATION SETTINGS */}
      <div className="border-b border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => toggleSection("conversation")}
          className="w-full flex items-center justify-between py-2.5 px-1 font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors text-xs"
        >
          <span>Conversation Settings</span>
          {openSections.conversation ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.conversation && (
          <div className="space-y-3 pb-4 px-1 pt-1 animate-in fade-in duration-150">
            {/* Ignore speech before welcome */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1 font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                <span>Ignore user speech before welcome message</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <ToggleSwitch
                checked={ignoreSpeechBeforeWelcome}
                onChange={setIgnoreSpeechBeforeWelcome}
              />
            </div>

            {/* Welcome message delay */}
            <SliderRow
              label="Welcome message delay (in ms)"
              value={welcomeDelay}
              min={0}
              max={3000}
              step={100}
              onChange={setWelcomeDelay}
            />

            {/* Hang up on user silence */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                  <span>Hang up on user silence (in s)</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <ToggleSwitch
                  checked={hangupSilenceEnabled}
                  onChange={setHangupSilenceEnabled}
                />
              </div>
              {hangupSilenceEnabled && (
                <SliderRow
                  label=""
                  value={hangupSilenceSeconds}
                  min={5}
                  max={60}
                  step={1}
                  onChange={setHangupSilenceSeconds}
                />
              )}
            </div>

            {/* Maximum call duration */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                  <span>Maximum call duration (in s)</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <ToggleSwitch
                  checked={maxCallDurationEnabled}
                  onChange={setMaxCallDurationEnabled}
                />
              </div>
              {maxCallDurationEnabled && (
                <SliderRow
                  label=""
                  value={maxCallDurationSeconds}
                  min={60}
                  max={1800}
                  step={30}
                  onChange={setMaxCallDurationSeconds}
                />
              )}
            </div>

            {/* Words before interruption */}
            <SliderRow
              label="Words before interruption"
              value={wordsBeforeInterruption}
              min={1}
              max={10}
              step={1}
              onChange={setWordsBeforeInterruption}
            />

            {/* Check if user is online */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                  <span>Check if user is online (in s)</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <ToggleSwitch
                  checked={checkUserOnlineEnabled}
                  onChange={setCheckUserOnlineEnabled}
                />
              </div>
              {checkUserOnlineEnabled && (
                <SliderRow
                  label=""
                  value={checkUserOnlineSeconds}
                  min={5}
                  max={30}
                  step={1}
                  onChange={setCheckUserOnlineSeconds}
                />
              )}
            </div>

            {/* Check message */}
            {checkUserOnlineEnabled && (
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Check message
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCheckMessageLang("Hindi");
                      setCheckMessageText("Hello, क्या आप अभी भी लाइन पर हैं?");
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-semibold transition-all",
                      checkMessageLang === "Hindi"
                        ? "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    Hindi
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckMessageLang("English");
                      setCheckMessageText("Hello, are you still on the line?");
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-semibold transition-all",
                      checkMessageLang === "English"
                        ? "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    English
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={checkMessageText}
                    onChange={(e) => setCheckMessageText(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs leading-relaxed outline-none focus:border-blue-500 pr-16"
                  />
                  <span className="absolute bottom-2 right-2 text-[10px] text-slate-400">
                    {checkMessageText.length} chars
                  </span>
                </div>
              </div>
            )}

            {/* Voicemail detection */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1 font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                <span>Voicemail detection (in s)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <ToggleSwitch
                checked={voicemailDetection}
                onChange={setVoicemailDetection}
              />
            </div>

            {/* Agent-initiated hangup */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1 font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                <span>Agent-initiated hangup</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <ToggleSwitch
                checked={agentInitiatedHangup}
                onChange={setAgentInitiatedHangup}
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. KNOWLEDGE BASE */}
      <div className="border-b border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => toggleSection("kb")}
          className="w-full flex items-center justify-between py-2.5 px-1 font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors text-xs"
        >
          <span>Knowledge Base</span>
          {openSections.kb ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.kb && (
          <div className="space-y-3 pb-4 px-1 pt-1 animate-in fade-in duration-150">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Applied to all nodes that don&apos;t have their own knowledge base.
            </p>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Knowledge bases
              </label>
              <select
                value={selectedKb}
                onChange={(e) => setSelectedKb(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
              >
                <option value="">Select knowledge bases</option>
                <option value="company-faq">Company FAQ & Returns Policy</option>
                <option value="product-catalog">Product Catalog 2026</option>
                <option value="support-troubleshooting">Support & Troubleshooting Manual</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 6. ADVANCED JSON */}
      <div className="border-b border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => toggleSection("json")}
          className="w-full flex items-center justify-between py-2.5 px-1 font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors text-xs"
        >
          <span>Advanced JSON</span>
          {openSections.json ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.json && (
          <div className="space-y-3 pb-4 px-1 pt-1 animate-in fade-in duration-150">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Use this only for configs that are not exposed in the graph-agent settings cards yet.
            </p>

            {/* Sub-Accordion 1: Input / Output / Task Config */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() =>
                  setOpenSections((prev) => ({
                    ...prev,
                    ioTask: prev.ioTask === undefined ? false : !prev.ioTask,
                  }))
                }
                className="w-full flex items-center justify-between py-1 text-left font-semibold text-[11px] text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors border-b border-slate-100 dark:border-slate-800/60 pb-1"
              >
                <span className="underline underline-offset-2">
                  Input / Output / Task Config
                </span>
                {openSections.ioTask !== false ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openSections.ioTask !== false && (
                <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Input config
                    </label>
                    <textarea
                      rows={4}
                      defaultValue={`{\n  "format": "wav",\n  "provider": "vobiz"\n}`}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-[11px] leading-relaxed outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Output config
                    </label>
                    <textarea
                      rows={4}
                      defaultValue={`{\n  "format": "wav",\n  "provider": "vobiz"\n}`}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-[11px] leading-relaxed outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Conversation task config
                    </label>
                    <textarea
                      rows={8}
                      defaultValue={`{\n  "voicemail": false,\n  "use_fillers": false,\n  "dtmf_enabled": false,\n  "ambient_noise": false,\n  "inbound_limit": -1,\n  "backchanneling": false,\n  "call_terminate": 300,\n  "auto_reschedule": false,\n  "optimize_latency": true,\n  "incremental_delay": 200\n}`}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-[11px] leading-relaxed outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sub-Accordion 2: API Tools / Additional Tasks / Agent Fields */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() =>
                  setOpenSections((prev) => ({
                    ...prev,
                    apiTasks: prev.apiTasks === undefined ? false : !prev.apiTasks,
                  }))
                }
                className="w-full flex items-center justify-between py-1 text-left font-semibold text-[11px] text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors border-b border-slate-100 dark:border-slate-800/60 pb-1"
              >
                <span>API Tools / Additional Tasks / Agent Fields</span>
                {openSections.apiTasks !== false ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openSections.apiTasks !== false && (
                <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      API tools config
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="null"
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-[11px] leading-relaxed outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Additional tasks
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="[]"
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-[11px] leading-relaxed outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Additional agent config
                    </label>
                    <textarea
                      rows={8}
                      defaultValue={`{\n  "agent_type": "graph_agent",\n  "webhook_url": null,\n  "gpt_assistants": null,\n  "custom_analytics": null,\n  "inbound_phone_number": null,\n  "restricted": false,\n  "calling_guardrails": null,\n  "webhook_headers": null,\n  "sip_header_variables": null,\n  "ingest_lookup_key": null\n}`}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-[11px] leading-relaxed outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  hasInfo = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  hasInfo?: boolean;
}) {
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
          <span>{label}</span>
          {hasInfo && <Info className="w-3 h-3 text-slate-400" />}
        </div>
      )}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-1.5 bg-blue-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-14 h-7 px-1.5 text-center rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "w-8 h-4.5 rounded-full p-0.5 transition-colors shrink-0",
        checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
      )}
    >
      <div
        className={cn(
          "w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform",
          checked ? "translate-x-3.5" : "translate-x-0"
        )}
      />
    </button>
  );
}
