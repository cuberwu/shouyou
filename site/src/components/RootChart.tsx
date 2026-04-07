"use client";

import { useState } from "react";

import {
  getRootChartRows,
  practiceSchemeOrder,
  rootPracticeSchemes,
  type PracticeSchemeKey,
} from "@/lib/practice/rootPractice";

export default function RootChart() {
  const [activeScheme, setActiveScheme] = useState<PracticeSchemeKey>("plus");

  return (
    <div className="site-panel mx-auto flex h-full w-full min-w-0 max-w-[44rem] flex-col overflow-hidden p-3 sm:p-7 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-[clamp(0.82rem,0.35vw+0.72rem,1rem)] font-semibold text-slate-800">
          首右{rootPracticeSchemes[activeScheme].label}字根图
        </div>

        <div
          className="flex items-center rounded-full border border-slate-200 bg-white/80 p-1 text-[clamp(0.62rem,0.22vw+0.56rem,0.78rem)] font-semibold"
          role="group"
          aria-label="字根图版本切换"
        >
          {practiceSchemeOrder.map((schemeKey) => {
            const scheme = rootPracticeSchemes[schemeKey];
            const isActive = activeScheme === schemeKey;

            return (
              <button
                key={schemeKey}
                type="button"
                aria-pressed={isActive}
                aria-controls={`root-chart-${schemeKey}`}
                onClick={() => setActiveScheme(schemeKey)}
                className={`cursor-pointer rounded-full px-2.5 py-1 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:px-3 ${
                  isActive
                    ? "text-white shadow-[var(--shadow-sm)]"
                    : "text-slate-600 hover:text-slate-800"
                }`}
                style={isActive ? { background: scheme.accent } : undefined}
              >
                {scheme.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid flex-1">
        {practiceSchemeOrder.map((schemeKey) => {
          const isActive = activeScheme === schemeKey;
          const accentText =
            schemeKey === "basic"
              ? "text-[var(--color-primary)]"
              : "text-[var(--color-plus)]";
          const hoverBorder =
            schemeKey === "basic"
              ? "hover:border-emerald-200"
              : "hover:border-violet-200";

          return (
            <div
              key={schemeKey}
              id={`root-chart-${schemeKey}`}
              aria-hidden={!isActive}
              className={`col-start-1 row-start-1 transition-all duration-300 ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              <div className="mx-auto w-full max-w-[42rem] space-y-1.5 sm:space-y-2.5 lg:space-y-3">
                {getRootChartRows(schemeKey).map((row, rowIndex) => {
                  const rowInsetClass =
                    rowIndex === 0
                      ? ""
                      : rowIndex === 1
                        ? "px-[4%] sm:px-[6%] lg:px-[7%]"
                        : "px-[13%] sm:px-[15%] lg:px-[17%]";

                  return (
                    <div
                      key={`${schemeKey}-row-${rowIndex}`}
                      className={`grid gap-0.5 sm:gap-2 lg:gap-3 ${rowInsetClass}`}
                      style={{
                        gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {row.map((item) => {
                        const dense = item.radicals.length > 3;

                        return (
                          <div
                            key={`${schemeKey}-${item.key}`}
                            className={`flex aspect-[0.7/1] min-h-[50px] w-full min-w-0 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-0.5 text-center shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] sm:min-h-[60px] sm:px-1 lg:min-h-[74px] ${hoverBorder}`}
                          >
                            <div className="font-mono text-[clamp(0.58rem,0.36vw+0.5rem,0.95rem)] font-semibold leading-none text-slate-800">
                              {item.key}
                            </div>
                            <div
                              className={`mt-0.5 font-semibold ${accentText} ${
                                dense
                                  ? "grid grid-cols-2 gap-x-1 gap-y-0 text-[clamp(0.42rem,0.26vw+0.38rem,0.7rem)] leading-none"
                                  : "flex flex-col items-center gap-0 text-[clamp(0.5rem,0.28vw+0.46rem,0.78rem)] leading-none"
                              }`}
                            >
                              {item.radicals.map((radical, index) => (
                                <span key={`${item.key}-${radical}-${index}`}>{radical}</span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
