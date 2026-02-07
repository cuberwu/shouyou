"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  filterLookupQuery,
  formatRadicals,
  loadPujiChaifenDictionary,
  type ChaifenEntry,
} from "@/lib/chaifenData";

type SchemeKey = "basic" | "plus";

type SchemeOption = {
  key: SchemeKey;
  label: string;
  accent: string;
  status: "ready" | "pending";
};

type LookupGroup = {
  token: string;
  entries: ChaifenEntry[];
};

const schemeOptions: SchemeOption[] = [
  {
    key: "basic",
    label: "普及版",
    accent: "var(--color-primary)",
    status: "ready",
  },
  {
    key: "plus",
    label: "Plus 版",
    accent: "var(--color-plus)",
    status: "pending",
  },
];

const lookupSteps = [
  "选择方案版本（普及版 / Plus 版）",
  "输入汉字或词组",
  "获取编码与拆分",
  "支持批量查询",
];

export default function LookupPage() {
  const [activeScheme, setActiveScheme] = useState<SchemeKey>("basic");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [dictionary, setDictionary] = useState<
    Record<string, ChaifenEntry[]>
  >({});
  const [loadState, setLoadState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [loadError, setLoadError] = useState<string | null>(null);

  const activeSchemeLabel =
    schemeOptions.find((option) => option.key === activeScheme)?.label ??
    "普及版";

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const loadDictionary = async () => {
      setLoadState("loading");
      setLoadError(null);

      try {
        const parsedDictionary = await loadPujiChaifenDictionary(controller.signal);
        if (!isActive) {
          return;
        }

        setDictionary(parsedDictionary);
        setLoadState("ready");
      } catch (error) {
        if (!isActive) {
          return;
        }

        setLoadState("error");
        setLoadError(
          error instanceof Error ? error.message : "码表读取失败"
        );
      }
    };

    loadDictionary();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const searchResults = useMemo<LookupGroup[]>(() => {
    const normalizedQuery = filterLookupQuery(submittedQuery);
    if (!normalizedQuery) {
      return [];
    }

    return Array.from(normalizedQuery).map((char) => ({
      token: char,
      entries: dictionary[char] ?? [],
    }));
  }, [submittedQuery, dictionary]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filteredQuery = filterLookupQuery(query);
    setSubmittedQuery(filteredQuery);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[var(--shadow-md)]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              查形工具
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              在线编码查询
            </h1>
            <p className="text-sm leading-relaxed text-slate-600">
              输入汉字即可查看编码与拆分过程，支持批量查询与特殊字标注。
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              方案选择
            </span>
            <div
              className="flex flex-wrap items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 text-[11px] font-semibold"
              role="group"
              aria-label="方案选择"
            >
              {schemeOptions.map((option) => {
                const isActive = activeScheme === option.key;
                const isDisabled = option.status === "pending";
                return (
                  <button
                    key={option.key}
                    type="button"
                    aria-pressed={isActive}
                    aria-disabled={isDisabled}
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        setActiveScheme(option.key);
                      }
                    }}
                    className={`flex items-center gap-2 rounded-full px-3 py-1 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                      isDisabled
                        ? "cursor-not-allowed text-slate-400"
                        : "cursor-pointer text-slate-600 hover:text-slate-800"
                    } ${
                      isActive
                        ? "text-white shadow-[var(--shadow-sm)]"
                        : "bg-transparent"
                    }`}
                    style={isActive ? { background: option.accent } : undefined}
                  >
                    <span>{option.label}</span>
                    {option.status === "pending" ? (
                      <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                        未就绪
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-slate-500">
              普及版数据已接入，Plus 版准备中。
            </span>
          </div>

          <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="lookup-page-input">
              输入汉字
            </label>
            <input
              id="lookup-page-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-[var(--shadow-sm)] focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="请输入需要查询的内容"
            />
            <button
              className="cursor-pointer rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:translate-y-[-1px] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              type="submit"
            >
              查询
            </button>
          </form>

          {submittedQuery ? (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-800">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-emerald-700">
                <span>查询结果</span>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] text-emerald-700">
                  {activeSchemeLabel}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-start gap-3 text-sm text-emerald-700">
                {loadState === "loading" ? (
                  <div className="w-full">码表加载中...</div>
                ) : null}
                {loadState === "error" ? (
                  <div className="w-full text-amber-600">
                    码表加载失败：{loadError ?? "未知错误"}
                  </div>
                ) : null}
                {loadState === "ready" ? (
                  searchResults.length > 0 ? (
                    searchResults.map((group, groupIndex) => (
                      <div
                        key={`${group.token}-${groupIndex}`}
                        className="w-fit max-w-full rounded-xl border border-emerald-100 bg-white/70 p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-800">
                          <span>{group.token}</span>
                        </div>
                        {group.entries.length > 0 ? (
                          <div className="mt-2 space-y-2 text-sm text-emerald-800">
                            {group.entries.map((entry, entryIndex) => (
                              <div
                                key={`${entry.word}-${entryIndex}`}
                                className="space-y-1"
                              >
                                <div>编码：{entry.code}</div>
                                <div>拆分：{formatRadicals(entry.radicals)}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-2 text-sm text-emerald-600">
                            未找到对应拆分
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-emerald-700">未找到对应拆分</div>
                  )
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[var(--shadow-md)]">
          <h2 className="text-lg font-semibold text-slate-900">功能说明</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {lookupSteps.map((step) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
            * 当前仅接入普及版拆分码表，Plus 版数据准备中。
          </div>
        </div>
      </section>
    </main>
  );
}
