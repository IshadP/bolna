"use client";

import React, { useState } from "react";
import {
  PanelLeftClose,
  PanelLeft,
  Building2,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  GitBranch,
  Workflow,
  LibraryBig,
  Megaphone,
  Layers,
  Hash,
  Phone,
  History,
  PieChart,
  FileSpreadsheet,
  Code,
  Settings as SettingsIcon,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeftSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function LeftSidebar({ activeTab = "Graph Agent", onTabChange }: LeftSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [buildOpen, setBuildOpen] = useState(true);
  const [deployOpen, setDeployOpen] = useState(true);
  const [monitorOpen, setMonitorOpen] = useState(true);
  const [developersOpen, setDevelopersOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside
      className={cn(
        "h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 select-none transition-all duration-200 z-20",
        collapsed ? "w-[56px]" : "w-[170px]"
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {/* Logo & Collapse Header */}
        <div className="h-12 flex items-center justify-between px-3 border-b border-slate-100 dark:border-slate-800/80">
          {!collapsed && (
            <div className="flex items-center gap-1.5 font-mono">
              <div className="flex items-center gap-[2px] text-blue-600">
                <span className="h-3 w-[2px] bg-blue-600 rounded-full inline-block"></span>
                <span className="h-4.5 w-[2.5px] bg-blue-600 rounded-full inline-block"></span>
                <span className="h-2.5 w-[2px] bg-blue-600 rounded-full inline-block"></span>
              </div>
              <span className="font-extrabold text-[13px] tracking-wider text-slate-900 dark:text-slate-100">
                BOLNA
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors ml-auto"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Workspace selector */}
        {!collapsed && (
          <div className="p-2 border-b border-slate-100 dark:border-slate-800/60">
            <button className="w-full flex items-center gap-2 p-1.5 rounded-lg border border-slate-200/70 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-left transition-colors">
              <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                  bolna.ai
                </div>
                <div className="text-[10px] text-slate-400 truncate leading-tight">
                  Active
                </div>
              </div>
              <ChevronsUpDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          </div>
        )}

        {/* Navigation Groups */}
        <div className="p-1.5 space-y-3 text-xs">
          {/* BUILD GROUP */}
          <div>
            {!collapsed && (
              <button
                onClick={() => setBuildOpen(!buildOpen)}
                className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase hover:text-slate-600 transition-colors"
              >
                <span>Build</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform",
                    !buildOpen && "-rotate-90"
                  )}
                />
              </button>
            )}
            {(buildOpen || collapsed) && (
              <div className="space-y-0.5 mt-0.5">
                <NavItem
                  icon={<Bot className="w-3.5 h-3.5" />}
                  label="Agent Studio"
                  active={activeTab === "Agent Studio"}
                  collapsed={collapsed}
                  onClick={() => onTabChange && onTabChange("Agent Studio")}
                />
                <NavItem
                  icon={<GitBranch className="w-3.5 h-3.5" />}
                  label="Graph Agent"
                  active={activeTab === "Graph Agent"}
                  collapsed={collapsed}
                  onClick={() => onTabChange && onTabChange("Graph Agent")}
                />
                <NavItem
                  icon={<Workflow className="w-3.5 h-3.5" />}
                  label="Workflows"
                  badge="Beta"
                  active={activeTab === "Workflows"}
                  collapsed={collapsed}
                  onClick={() => onTabChange && onTabChange("Workflows")}
                />
                <NavItem
                  icon={<LibraryBig className="w-3.5 h-3.5" />}
                  label="Knowledge Base"
                  active={activeTab === "Knowledge Base"}
                  collapsed={collapsed}
                  onClick={() => onTabChange && onTabChange("Knowledge Base")}
                />
              </div>
            )}
          </div>

          {/* DEPLOY GROUP */}
          <div>
            {!collapsed && (
              <button
                onClick={() => setDeployOpen(!deployOpen)}
                className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase hover:text-slate-600 transition-colors"
              >
                <span>Deploy</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform",
                    !deployOpen && "-rotate-90"
                  )}
                />
              </button>
            )}
            {(deployOpen || collapsed) && (
              <div className="space-y-0.5 mt-0.5">
                <NavItem
                  icon={<Megaphone className="w-3.5 h-3.5" />}
                  label="Campaigns"
                  badge="Beta"
                  active={activeTab === "Campaigns"}
                  collapsed={collapsed}
                  onClick={() => onTabChange && onTabChange("Campaigns")}
                />
                <NavItem
                  icon={<Layers className="w-3.5 h-3.5" />}
                  label="Batches"
                  active={activeTab === "Batches"}
                  collapsed={collapsed}
                  onClick={() => onTabChange && onTabChange("Batches")}
                />
                <NavItem
                  icon={<Hash className="w-3.5 h-3.5" />}
                  label="My Numbers"
                  active={activeTab === "My Numbers"}
                  collapsed={collapsed}
                  onClick={() => onTabChange && onTabChange("My Numbers")}
                />
                <NavItem
                  icon={<Phone className="w-3.5 h-3.5" />}
                  label="SIP Trunks"
                  active={activeTab === "SIP Trunks"}
                  collapsed={collapsed}
                  onClick={() => onTabChange && onTabChange("SIP Trunks")}
                />
              </div>
            )}
          </div>

          {/* MONITOR GROUP */}
          <div>
            {!collapsed && (
              <button
                onClick={() => setMonitorOpen(!monitorOpen)}
                className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase hover:text-slate-600 transition-colors"
              >
                <span>Monitor</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform",
                    !monitorOpen && "-rotate-90"
                  )}
                />
              </button>
            )}
            {(monitorOpen || collapsed) && (
              <div className="space-y-0.5 mt-0.5">
                <NavItem
                  icon={<History className="w-3.5 h-3.5" />}
                  label="Call History"
                  active={activeTab === "Call History"}
                  collapsed={collapsed}
                  onClick={() => onTabChange && onTabChange("Call History")}
                />
                <NavItem
                  icon={<PieChart className="w-3.5 h-3.5" />}
                  label="Analytics"
                  active={activeTab === "Analytics"}
                  collapsed={collapsed}
                  onClick={() => onTabChange && onTabChange("Analytics")}
                />
                <NavItem
                  icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
                  label="Reports"
                  active={activeTab === "Reports"}
                  collapsed={collapsed}
                  onClick={() => onTabChange && onTabChange("Reports")}
                />
              </div>
            )}
          </div>

          {/* DEVELOPERS */}
          <div className="pt-1">
            <button
              onClick={() => setDevelopersOpen(!developersOpen)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-slate-500" />
                {!collapsed && (
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Developers
                  </span>
                )}
              </div>
              {!collapsed && (
                <ChevronRight
                  className={cn(
                    "w-3 h-3 text-slate-400 transition-transform",
                    developersOpen && "rotate-90"
                  )}
                />
              )}
            </button>
          </div>

          {/* SETTINGS */}
          <div>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-3.5 h-3.5 text-slate-500" />
                {!collapsed && (
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Settings
                  </span>
                )}
              </div>
              {!collapsed && (
                <ChevronRight
                  className={cn(
                    "w-3 h-3 text-slate-400 transition-transform",
                    settingsOpen && "rotate-90"
                  )}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
            P
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                Ishad Pande
              </div>
              <div className="text-[10px] text-slate-400 truncate leading-tight">
                ishadpande16@gmail.c...
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  badge,
  active,
  collapsed,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors relative group",
        active
          ? "bg-slate-100/90 text-slate-900 font-semibold dark:bg-slate-800 dark:text-slate-100 shadow-2xs"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60"
      )}
      title={collapsed ? label : undefined}
    >
      <span className={cn("shrink-0", active ? "text-slate-900 dark:text-slate-100" : "text-slate-500")}>
        {icon}
      </span>
      {!collapsed && (
        <>
          <span className="truncate flex-1 text-left">{label}</span>
          {badge && (
            <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded leading-tight">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}
