"use client";

import { useState } from "react";

type VersionKey = "basic" | "plus";

type RootKey = {
  key: string;
  radicals: string;
};

type RootChartData = {
  label: string;
  accent: string;
  rows: RootKey[][];
};

const rootCharts: Record<VersionKey, RootChartData> = {
  basic: {
    label: "普及版",
    accent: "var(--color-primary)",
    rows: [
      [
        { key: "Q", radicals: "火" },
        { key: "W", radicals: "王" },
        { key: "E", radicals: "禾" },
        { key: "R", radicals: "亻" },
        { key: "T", radicals: "土" },
        { key: "Y", radicals: "月" },
        { key: "U", radicals: "氵" },
        { key: "I", radicals: "纟" },
        { key: "O", radicals: "虫" },
        { key: "P", radicals: "撇" },
      ],
      [
        { key: "A", radicals: "讠" },
        { key: "S", radicals: "竖" },
        { key: "D", radicals: "点" },
        { key: "F", radicals: "扌" },
        { key: "G", radicals: "竹辶" },
        { key: "H", radicals: "横" },
        { key: "J", radicals: "钅" },
        { key: "K", radicals: "口" },
        { key: "L", radicals: "日" },
      ],
      [
        { key: "Z", radicals: "⻊" },
        { key: "X", radicals: "忄" },
        { key: "C", radicals: "艹" },
        { key: "V", radicals: "折" },
        { key: "B", radicals: "宀" },
        { key: "N", radicals: "女" },
        { key: "M", radicals: "木" },
      ],
    ],
  },
  plus: {
    label: "Plus 版",
    accent: "var(--color-plus)",
    rows: [
      [
        { key: "Q", radicals: "火龶" },
        { key: "W", radicals: "王亠攵" },
        { key: "E", radicals: "禾阝" },
        { key: "R", radicals: "亻彳" },
        { key: "T", radicals: "土田" },
        { key: "Y", radicals: "月又雨" },
        { key: "U", radicals: "氵" },
        { key: "I", radicals: "纟厶" },
        { key: "O", radicals: "虫刂" },
        { key: "P", radicals: "撇" },
      ],
      [
        { key: "A", radicals: "讠" },
        { key: "S", radicals: "竖饣石尸" },
        { key: "D", radicals: "点目" },
        { key: "F", radicals: "扌十" },
        { key: "G", radicals: "竹辶山弓" },
        { key: "H", radicals: "横" },
        { key: "J", radicals: "钅几巾" },
        { key: "K", radicals: "口" },
        { key: "L", radicals: "日⺈力大" },
      ],
      [
        { key: "Z", radicals: "⻊子西疒" },
        { key: "X", radicals: "忄小彐广" },
        { key: "C", radicals: "艹车乂寸" },
        { key: "V", radicals: "折舟" },
        { key: "B", radicals: "宀贝勹八犭" },
        { key: "N", radicals: "女鸟" },
        { key: "M", radicals: "木门" },
      ],
    ],
  },
};

const versionOrder: VersionKey[] = ["basic", "plus"];

const splitRadicals = (value: string) =>
  Array.from(value).filter((item) => item.trim().length > 0);

export default function RootChart() {
  const [active, setActive] = useState<VersionKey>("plus");

  return (
    <div className="mx-auto flex h-full w-full min-w-0 max-w-[44rem] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-3 shadow-[var(--shadow-lg)] sm:p-7 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[clamp(0.82rem,0.35vw+0.72rem,1rem)] font-semibold text-slate-800">
            首右{rootCharts[active].label}字根图
          </div>
        </div>
        <div
          className="flex items-center rounded-full border border-slate-200 bg-white/80 p-1 text-[clamp(0.62rem,0.22vw+0.56rem,0.78rem)] font-semibold"
          role="group"
          aria-label="字根图版本切换"
        >
          {versionOrder.map((versionKey) => {
            const chart = rootCharts[versionKey];
            const isActive = active === versionKey;
            return (
              <button
                key={versionKey}
                type="button"
                aria-pressed={isActive}
                aria-controls={`root-chart-${versionKey}`}
                onClick={() => setActive(versionKey)}
                className={`cursor-pointer rounded-full px-2.5 py-1 sm:px-3 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                  isActive
                    ? "text-white shadow-[var(--shadow-sm)]"
                    : "text-slate-600 hover:text-slate-800"
                }`}
                style={isActive ? { background: chart.accent } : undefined}
              >
                {chart.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 grid flex-1">
        {versionOrder.map((versionKey) => {
          const chart = rootCharts[versionKey];
          const isActive = active === versionKey;
          const accentText =
            versionKey === "basic"
              ? "text-[var(--color-primary)]"
              : "text-[var(--color-plus)]";
          const hoverBorder =
            versionKey === "basic"
              ? "hover:border-emerald-200"
              : "hover:border-violet-200";
          return (
            <div
              key={versionKey}
              id={`root-chart-${versionKey}`}
              aria-hidden={!isActive}
              className={`col-start-1 row-start-1 transition-all duration-300 ${
                isActive
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 translate-y-2"
              }`}
            >
              <div className="mx-auto w-full max-w-[42rem] space-y-1.5 sm:space-y-2.5 lg:space-y-3">
                {chart.rows.map((row, rowIndex) => {
                  const rowInsetClass =
                    rowIndex === 0
                      ? ""
                      : rowIndex === 1
                        ? "px-[4%] sm:px-[6%] lg:px-[7%]"
                        : "px-[13%] sm:px-[15%] lg:px-[17%]";
                  return (
                    <div
                      key={`${versionKey}-row-${rowIndex}`}
                      className={`grid gap-0.5 sm:gap-2 lg:gap-3 ${rowInsetClass}`}
                      style={{
                        gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {row.map((item) => {
                        const radicals = splitRadicals(item.radicals);
                        const dense = radicals.length > 3;
                        return (
                          <div
                            key={`${versionKey}-${item.key}`}
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
                              {radicals.map((radical, index) => (
                                <span key={`${item.key}-${radical}-${index}`}>
                                  {radical}
                                </span>
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
