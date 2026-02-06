"use client";

import { useCallback } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type Props = {
  headings: Heading[];
};

export default function TutorialSideActions({ headings }: Props) {
  const scrollToHeading = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const offset = 112;
    window.scrollTo({ top: Math.max(0, targetTop - offset), behavior: "smooth" });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <aside className="space-y-4">
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6">
        <h3 className="text-sm font-semibold text-emerald-900">本页目录</h3>
        <ul className="mt-4 space-y-2 text-sm text-emerald-700">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                type="button"
                onClick={() => scrollToHeading(heading.id)}
                className={`block cursor-pointer text-left transition-colors duration-200 hover:text-emerald-900 ${
                  heading.level === 3 ? "pl-4 text-emerald-600" : ""
                }`}
              >
                {heading.text}
              </button>
            </li>
          ))}
          {headings.length === 0 ? (
            <li className="text-xs text-emerald-600">该文档暂无目录条目</li>
          ) : null}
        </ul>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-4 py-2 text-sm font-medium text-emerald-700 shadow-[var(--shadow-sm)] transition-colors duration-200 hover:border-emerald-300 hover:text-emerald-800"
      >
        ↑ 返回顶部
      </button>
    </aside>
  );
}
