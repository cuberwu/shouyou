"use client";

import { useState } from "react";

import RootPracticeTrainer from "@/components/practice/RootPracticeTrainer";
import type { RootPracticeTopInfo } from "@/components/practice/RootPracticeTrainer";

type PracticeProject = "root" | "split";

const projectOptions: Array<{ key: PracticeProject; label: string }> = [
  { key: "root", label: "字根练习" },
  { key: "split", label: "拆分练习" },
];

const initialRootTopInfo: RootPracticeTopInfo = {
  progress: "--",
  accuracy: "--",
  retry: "--",
};

export default function PracticePage() {
  const [activeProject, setActiveProject] = useState<PracticeProject>("root");
  const [rootTopInfo, setRootTopInfo] = useState<RootPracticeTopInfo>(initialRootTopInfo);

  const topInfoItems =
    activeProject === "root"
      ? [
          `进度 ${rootTopInfo.progress}`,
          `正确率 ${rootTopInfo.accuracy}`,
          `回炉 ${rootTopInfo.retry}`,
        ]
      : ["开发中"];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-20 pt-8">
      <section className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
              练习中心
            </span>

            <div
              className="inline-flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1"
              role="tablist"
              aria-label="练习项目切换"
            >
              {projectOptions.map((option) => {
                const isActive = activeProject === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setActiveProject(option.key)}
                    aria-pressed={isActive}
                    className={`inline-flex h-9 min-w-[7rem] cursor-pointer items-center justify-center rounded-xl border px-4 py-1.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                      isActive
                        ? "border-emerald-200 bg-white text-emerald-700 shadow-[0_6px_16px_rgba(16,185,129,0.18)]"
                        : "border-transparent bg-transparent text-slate-500 hover:bg-white/80 hover:text-slate-700"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {topInfoItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-emerald-100 bg-white px-2.5 py-1 font-medium text-emerald-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {activeProject === "root" ? (
        <RootPracticeTrainer onTopInfoChange={setRootTopInfo} />
      ) : (
        <section className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">拆分练习</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              开发中
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            该项目将用于字词拆分训练，强化拆分方向与编码稳定性。
          </p>
        </section>
      )}
    </main>
  );
}

