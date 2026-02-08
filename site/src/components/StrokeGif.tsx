"use client";

import { useMemo, useState } from "react";

import { getStrokeGifUrl } from "@/lib/strokeGif";

export type StrokeGifLoadState = "idle" | "loading" | "loaded" | "error";

type StrokeGifButtonProps = {
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
  label?: string;
  ariaLabel?: string;
};

type StrokeGifPanelProps = {
  char: string;
  isExpanded: boolean;
  gifUrl: string | null;
  loadState: StrokeGifLoadState;
  onLoad: () => void;
  onError: () => void;
  size?: number;
  className?: string;
};

const joinClassNames = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

export const useStrokeGif = (char: string, resetKey?: string) => {
  const [stateByKey, setStateByKey] = useState<
    Record<string, { isExpanded: boolean; loadState: StrokeGifLoadState }>
  >({});

  const stateKey = resetKey ?? char;
  const currentState = stateByKey[stateKey] ?? {
    isExpanded: false,
    loadState: "idle" as StrokeGifLoadState,
  };

  const gifUrl = useMemo(
    () => (currentState.isExpanded ? getStrokeGifUrl(char) : null),
    [currentState.isExpanded, char]
  );

  const toggleExpanded = () => {
    setStateByKey((prev) => {
      const prevState = prev[stateKey] ?? {
        isExpanded: false,
        loadState: "idle" as StrokeGifLoadState,
      };
      const nextExpanded = !prevState.isExpanded;
      const nextLoadState = nextExpanded
        ? getStrokeGifUrl(char)
          ? "loading"
          : "error"
        : "idle";

      return {
        ...prev,
        [stateKey]: {
          isExpanded: nextExpanded,
          loadState: nextLoadState,
        },
      };
    });
  };

  const onLoad = () => {
    setStateByKey((prev) => ({
      ...prev,
      [stateKey]: {
        isExpanded: true,
        loadState: "loaded",
      },
    }));
  };

  const onError = () => {
    setStateByKey((prev) => ({
      ...prev,
      [stateKey]: {
        isExpanded: true,
        loadState: "error",
      },
    }));
  };

  return {
    isExpanded: currentState.isExpanded,
    toggleExpanded,
    gifUrl,
    loadState: currentState.loadState,
    onLoad,
    onError,
  };
};

export const StrokeGifButton = ({
  isExpanded,
  onToggle,
  className,
  label = "笔顺",
  ariaLabel,
}: StrokeGifButtonProps) => (
  <button
    type="button"
    aria-label={ariaLabel ?? (isExpanded ? "收起笔顺动画" : "展开笔顺动画")}
    aria-pressed={isExpanded}
    onClick={onToggle}
    className={joinClassNames(
      "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]",
      isExpanded
        ? "border-emerald-300 bg-emerald-100 text-emerald-700"
        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700",
      className
    )}
  >
    <span className="sr-only">{label}</span>
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 20l4.5-1L19 8.5a2.121 2.121 0 0 0-3-3L5.5 16 4 20z" />
      <path d="M14.5 6.5l3 3" />
    </svg>
  </button>
);

export const StrokeGifPanel = ({
  char,
  isExpanded,
  gifUrl,
  loadState,
  onLoad,
  onError,
  size = 120,
  className,
}: StrokeGifPanelProps) => (
  <div
    className={joinClassNames(
      "grid transition-[grid-template-rows,opacity] duration-200",
      isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      className
    )}
  >
    <div className="overflow-hidden">
      <div className="flex flex-col items-center gap-2 pb-2 pt-2">
        {gifUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gifUrl}
            alt={`${char} 的笔顺动画`}
            width={size}
            height={size}
            loading="lazy"
            decoding="async"
            onLoad={onLoad}
            onError={onError}
            className={joinClassNames(
              "rounded-lg border border-emerald-100 bg-white object-contain shadow-[var(--shadow-sm)]",
              loadState === "loaded" ? "opacity-100" : "opacity-0"
            )}
          />
        ) : null}

        {loadState === "loading" ? (
          <div className="text-xs text-emerald-700">笔顺动画加载中...</div>
        ) : null}
        {loadState === "error" ? (
          <div className="text-xs text-amber-700">笔顺动画加载失败</div>
        ) : null}
      </div>
    </div>
  </div>
);

