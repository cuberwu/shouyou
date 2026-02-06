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
    <div className="w-full max-w-xl rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[var(--shadow-lg)] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-800">
            首右{rootCharts[active].label}字根图
          </div>
        </div>
        <div
          className="flex items-center rounded-full border border-slate-200 bg-white/80 p-1 text-[11px] font-semibold"
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
                className={`cursor-pointer rounded-full px-3 py-1 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
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
      <div className="mt-4 grid">
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
              <div className="space-y-1 sm:space-y-2 lg:-ml-4">
                {chart.rows.map((row, rowIndex) => {
                  const rowOffset =
                    rowIndex === 0
                      ? ""
                      : rowIndex === 1
                        ? "pl-2 sm:pl-3 lg:pl-4"
                        : "pl-4 sm:pl-6 lg:pl-8";
                  return (
                    <div
                      key={`${versionKey}-row-${rowIndex}`}
                      className={`flex justify-center gap-1 sm:gap-2 lg:gap-2.5 ${rowOffset}`}
                    >
                      {row.map((item) => {
                        const radicals = splitRadicals(item.radicals);
                        const dense = radicals.length > 3;
                        return (
                          <div
                            key={`${versionKey}-${item.key}`}
                            className={`flex h-[54px] w-[30px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-1 text-center shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] sm:h-[60px] sm:w-[38px] lg:h-[72px] lg:w-[46px] ${hoverBorder}`}
                          >
                            <div className="font-mono text-[10px] font-semibold leading-none text-slate-800 sm:text-xs lg:text-sm">
                              {item.key}
                            </div>
                            <div
                              className={`mt-0.5 font-semibold ${accentText} ${
                                dense
                                  ? "grid grid-cols-2 gap-x-1 gap-y-0 text-[8px] leading-none sm:text-[9px] lg:text-[10px]"
                                  : "flex flex-col items-center gap-0 text-[9px] leading-none sm:text-[10px] lg:text-[11px]"
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
