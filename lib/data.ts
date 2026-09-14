export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon: string;
}

export interface CostSegment {
  key: string;
  label: string;
  aria: string;
  width: string;
  color: string;
  value: string;
  roundLeft?: boolean;
  roundRight?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "Agent Studio", label: "Agent Studio", icon: "smart_toy" },
  { id: "Graph Agent", label: "Graph Agent", icon: "alt_route" },
  { id: "Call History", label: "Call History", icon: "call" },
  { id: "My Numbers", label: "My Numbers", icon: "tag" },
  { id: "SIP Trunks", label: "SIP Trunks", icon: "cell_tower" },
  { id: "Knowledge Base", label: "Knowledge Base", icon: "menu_book" },
  { id: "Batches", label: "Batches", icon: "layers" },
  { id: "Reports", label: "Reports", icon: "description" },
  { id: "Analytics", label: "Analytics", icon: "insights" },
  { id: "Developers", label: "Developers", icon: "terminal" },
  { id: "Providers", label: "Providers", icon: "memory" },
  { id: "Documentation", label: "Documentation", icon: "bookmark" },
];

export const TABS: TabItem[] = [
  { id: "Agent Instructions", label: "Agent Instructions", icon: "smart_toy" },
  { id: "Agent Settings", label: "Agent Settings", icon: "tune" },
  { id: "Audio & Call Configuration", label: "Audio & Call Configuration", icon: "headset" },
  { id: "Tools", label: "Tools", icon: "handyman" },
  { id: "Extractions", label: "Extractions", icon: "table_chart" },
  { id: "Inbound", label: "Inbound", icon: "ring_volume" },
];

export const COST_SEGMENTS: CostSegment[] = [
  {
    key: "agent_cost",
    label: "Agent Cost",
    aria: "Agent Cost: $0.035/min",
    width: "58.3333%",
    color: "#eab308", // Yellow
    value: "2,648 (88.03%)",
    roundLeft: true,
    roundRight: false,
  },
  {
    key: "telephony",
    label: "Telephony",
    aria: "Telephony: $0.005/min",
    width: "8.33333%",
    color: "#f97316", // Orange
    value: "174 (5.78%)",
    roundLeft: false,
    roundRight: false,
  },
  {
    key: "platform",
    label: "Platform",
    aria: "Platform: $0.02/min",
    width: "33.3333%",
    color: "#06b6d4", // Cyan
    value: "143 (4.75%)",
    roundLeft: false,
    roundRight: true,
  },
];

export const LANGUAGES = ["Hindi (Primary)"];

export const DEFAULT_WELCOME_MESSAGE = "Hello from Bolna";

export const DEFAULT_PROMPT_TEXT =
  "You are a helpful agent. You will help the customer with their queries and doubts. You will never speak more than 2 sentences. Keep your responses concise [agent_id] and [to_number]";

export const TIMEZONES = [
  { value: "Asia/Kolkata UTC+05:30", label: "Asia/Kolkata UTC+05:30" },
  { value: "America/New_York UTC-05:00", label: "America/New_York UTC-05:00" },
  { value: "Europe/London UTC+00:00", label: "Europe/London UTC+00:00" },
];

export const LLM_PROVIDERS = [{ value: "azure", label: "azure" }];
export const LLM_MODELS = [{ value: "gpt-4.1-mini cluster", label: "gpt-4.1-mini cluster" }];

export const STT_PROVIDERS = [{ value: "deepgram", label: "deepgram" }];
export const STT_MODELS = [{ value: "nova-3", label: "nova-3" }];

export const TTS_PROVIDERS = [{ value: "ElevenLabs", label: "ElevenLabs" }];
export const TTS_MODELS = [{ value: "Eleven Turbo v2.5", label: "Eleven Turbo v2.5" }];
export const TTS_VOICES = [{ value: "Tripti - Calm and Clear", label: "Tripti - Calm and Clear" }];

export const TELEPHONY_PROVIDERS = [{ value: "Vobiz", label: "Vobiz" }];
export const AMBIENT_NOISES = [{ value: "office-ambience", label: "office-ambience" }];
