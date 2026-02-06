"use client";

import { useEffect, useRef, useState } from "react";

import {
  rootKeyboardRows,
  type PracticeSchemeKey,
  rootPracticeSchemes,
} from "@/lib/practice/rootPractice";

const keyWidthRem = 5.25;
const keyHeightRem = 5.75;
const keyGapRem = 0.5;
const rowGapRem = 0.625;
const keyboardBaseWidthRem =
  rootKeyboardRows[0].length * keyWidthRem + (rootKeyboardRows[0].length - 1) * keyGapRem;
const keyboardBaseHeightRem =
  rootKeyboardRows.length * keyHeightRem + (rootKeyboardRows.length - 1) * rowGapRem;

type Props = {
  scheme: PracticeSchemeKey;
  activeKey?: string | null;
  activeRadical?: string | null;
};

export default function RootKeyboardChart({
  scheme,
  activeKey = null,
  activeRadical = null,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [keyboardScale, setKeyboardScale] = useState(1);

  const mappingLookup = new Map(
    rootPracticeSchemes[scheme].mappings.map((item) => [item.key, item])
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const updateScale = () => {
      const rootFontSize = Number.parseFloat(
        window.getComputedStyle(document.documentElement).fontSize || "16"
      );
      const baseWidthPx = keyboardBaseWidthRem * (Number.isFinite(rootFontSize) ? rootFontSize : 16);
      const nextScale = Math.min(1, container.clientWidth / baseWidthPx);

      setKeyboardScale((current) => (Math.abs(current - nextScale) < 0.01 ? current : nextScale));
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(container);
    window.addEventListener("resize", updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    <section className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">字根图</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {rootPracticeSchemes[scheme].label}
        </span>
      </div>

      <div ref={containerRef} className="mt-4 w-full overflow-hidden py-1">
        <div
          className="mx-auto transition-[width,height] duration-200 ease-out"
          style={{
            width: `${keyboardBaseWidthRem * keyboardScale}rem`,
            height: `${keyboardBaseHeightRem * keyboardScale}rem`,
          }}
        >
          <div
            className="origin-top-left transition-transform duration-200 ease-out"
            style={{
              width: `${keyboardBaseWidthRem}rem`,
              transform: `scale(${keyboardScale})`,
            }}
          >
            <div className="flex flex-col items-center gap-2.5">
              {rootKeyboardRows.map((row, rowIndex) => (
                <div
                  key={`${scheme}-row-${rowIndex}`}
                  className="flex min-w-max justify-center gap-2"
                  style={{ width: `${keyboardBaseWidthRem}rem` }}
                >
                  {row.map((keyCode) => {
                    const mapping = mappingLookup.get(keyCode);
                    const isActive = activeKey?.toUpperCase() === keyCode;
                    return (
                      <div
                        key={`${scheme}-${keyCode}`}
                        className={`h-[5.75rem] w-[5.25rem] shrink-0 rounded-2xl px-2 py-2 text-center shadow-[var(--shadow-sm)] transition-all duration-200 ${
                          isActive
                            ? "border-2 border-emerald-500 bg-emerald-100/90"
                            : "border border-emerald-100 bg-emerald-50/50"
                        }`}
                      >
                        <div className="text-lg font-bold uppercase tracking-[0.08em] text-emerald-700">
                          {keyCode}
                        </div>
                        <div className="mt-1 flex flex-wrap justify-center gap-x-1 gap-y-0.5 text-lg font-semibold leading-tight text-slate-700">
                          {mapping ? (
                            mapping.radicals.map((radical) => {
                              const isRadicalActive = isActive && activeRadical === radical;
                              return (
                                <span
                                  key={`${scheme}-${keyCode}-${radical}`}
                                  className={
                                    isRadicalActive
                                      ? "rounded bg-emerald-600 px-1 text-white"
                                      : undefined
                                  }
                                >
                                  {radical}
                                </span>
                              );
                            })
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

