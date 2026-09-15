"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface SlidingTabItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  badge?: React.ReactNode;
}

interface SlidingTabsProps<T extends string = string> {
  tabs: SlidingTabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
  pillClassName?: string;
  tabClassName?: string;
}

export function SlidingTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className,
  pillClassName,
  tabClassName,
}: SlidingTabsProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<T, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    ready: boolean;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  });

  const isFirstRender = useRef(true);
  const shouldReduceMotion = useReducedMotion();

  const updateIndicator = () => {
    const activeEl = tabRefs.current.get(activeTab);
    const containerEl = containerRef.current;
    if (!activeEl || !containerEl) return;

    const left = activeEl.offsetLeft;
    const top = activeEl.offsetTop;
    const width = activeEl.offsetWidth;
    const height = activeEl.offsetHeight;

    setIndicatorStyle((prev) => {
      if (
        prev.ready &&
        prev.left === left &&
        prev.top === top &&
        prev.width === width &&
        prev.height === height
      ) {
        return prev;
      }
      return {
        left,
        top,
        width,
        height,
        ready: true,
      };
    });
  };

  useIsomorphicLayoutEffect(() => {
    updateIndicator();
  }, [activeTab, tabs]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      isFirstRender.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Handle window/container resize
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const observer = new ResizeObserver(() => {
      updateIndicator();
    });

    observer.observe(containerEl);
    window.addEventListener("resize", updateIndicator);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeTab]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={cn(
        "relative flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-md text-xs font-semibold select-none",
        className
      )}
    >
      {/* 1 Single shared physically sliding background pill */}
      {indicatorStyle.ready && (
        <motion.div
          aria-hidden="true"
          className={cn(
            "absolute rounded-md bg-white dark:bg-slate-800 shadow-2xs pointer-events-none z-0",
            pillClassName
          )}
          initial={false}
          animate={{
            x: indicatorStyle.left,
            y: indicatorStyle.top,
            width: indicatorStyle.width,
            height: indicatorStyle.height,
          }}
          transition={
            isFirstRender.current || shouldReduceMotion
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                  mass: 0.8,
                }
          }
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}

      {/* Tabs */}
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
              else tabRefs.current.delete(tab.id);
            }}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 flex-1 py-1.5 px-1.5 rounded-md text-center transition-colors truncate text-xs flex items-center justify-center gap-1.5 cursor-pointer font-semibold",
              isActive
                ? "text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
              tabClassName
            )}
          >
            <span className="truncate">{tab.label}</span>
            {tab.badge && <span className="shrink-0">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
