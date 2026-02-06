"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import RootKeyboardChart from "@/components/practice/RootKeyboardChart";
import {
  buildRootQuestions,
  rootPracticeSchemes,
  type PracticeSchemeKey,
  type RootQuestion,
} from "@/lib/practice/rootPractice";

const shuffle = <T,>(source: T[]) => {
  const array = [...source];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const schemeList: PracticeSchemeKey[] = ["basic", "plus"];
const rootPracticeStorageKey = "shouyou.practice.root.v1";

export type RootPracticeTopInfo = {
  progress: string;
  accuracy: string;
  retry: string;
};

type RootPracticeTrainerProps = {
  onTopInfoChange?: (info: RootPracticeTopInfo) => void;
};

type SchemeProgressSnapshot = {
  mainQueue: RootQuestion[];
  retryQueue: RootQuestion[];
  attempts: number;
  correctAttempts: number;
  completedQuestionIds: string[];
  wrongOnCurrent: boolean;
};

type PersistedRootPracticeStateV1 = {
  version: 1;
  activeScheme: PracticeSchemeKey;
  mainQueue: RootQuestion[];
  retryQueue: RootQuestion[];
  attempts: number;
  correctAttempts: number;
  completedQuestionIds: string[];
  wrongOnCurrent: boolean;
};

type PersistedRootPracticeState = {
  version: 2;
  activeScheme: PracticeSchemeKey;
  schemes: Partial<Record<PracticeSchemeKey, SchemeProgressSnapshot>>;
};

const toSnapshotFromState = (params: {
  mainQueue: RootQuestion[];
  retryQueue: RootQuestion[];
  attempts: number;
  correctAttempts: number;
  completedSet: Set<string>;
  wrongOnCurrent: boolean;
}): SchemeProgressSnapshot => ({
  mainQueue: params.mainQueue,
  retryQueue: params.retryQueue,
  attempts: params.attempts,
  correctAttempts: params.correctAttempts,
  completedQuestionIds: Array.from(params.completedSet),
  wrongOnCurrent: params.wrongOnCurrent,
});

const createInitialSnapshot = (
  scheme: PracticeSchemeKey,
  options?: {
    shuffleMainQueue?: boolean;
  }
): SchemeProgressSnapshot => {
  const questions = buildRootQuestions(scheme);
  const mainQueue = options?.shuffleMainQueue ? shuffle(questions) : questions;

  return {
    mainQueue,
    retryQueue: [],
    attempts: 0,
    correctAttempts: 0,
    completedQuestionIds: [],
    wrongOnCurrent: false,
  };
};

const isRootQuestion = (value: unknown): value is RootQuestion => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Partial<RootQuestion>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.key === "string" &&
    typeof candidate.radical === "string"
  );
};

const normalizeSnapshot = (
  value: unknown,
  scheme: PracticeSchemeKey
): SchemeProgressSnapshot => {
  const initial = createInitialSnapshot(scheme);
  if (!value || typeof value !== "object") {
    return initial;
  }

  const source = value as Partial<SchemeProgressSnapshot>;
  return {
    mainQueue:
      Array.isArray(source.mainQueue) && source.mainQueue.every(isRootQuestion)
        ? source.mainQueue
        : initial.mainQueue,
    retryQueue:
      Array.isArray(source.retryQueue) && source.retryQueue.every(isRootQuestion)
        ? source.retryQueue
        : initial.retryQueue,
    attempts: typeof source.attempts === "number" ? source.attempts : 0,
    correctAttempts:
      typeof source.correctAttempts === "number" ? source.correctAttempts : 0,
    completedQuestionIds: Array.isArray(source.completedQuestionIds)
      ? source.completedQuestionIds.filter((item): item is string => typeof item === "string")
      : [],
    wrongOnCurrent:
      typeof source.wrongOnCurrent === "boolean" ? source.wrongOnCurrent : false,
  };
};

const normalizePersistedState = (): PersistedRootPracticeState | null => {
  const raw = window.localStorage.getItem(rootPracticeStorageKey);
  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const version = (parsed as { version?: unknown }).version;

  if (version === 2) {
    const data = parsed as Partial<PersistedRootPracticeState>;
    const activeScheme: PracticeSchemeKey = data.activeScheme === "plus" ? "plus" : "basic";
    const schemesObject =
      data.schemes && typeof data.schemes === "object"
        ? (data.schemes as Partial<Record<PracticeSchemeKey, unknown>>)
        : {};

    const schemes: Partial<Record<PracticeSchemeKey, SchemeProgressSnapshot>> = {};
    if (schemesObject.basic !== undefined) {
      schemes.basic = normalizeSnapshot(schemesObject.basic, "basic");
    }
    if (schemesObject.plus !== undefined) {
      schemes.plus = normalizeSnapshot(schemesObject.plus, "plus");
    }

    return {
      version: 2,
      activeScheme,
      schemes,
    };
  }

  if (version === 1) {
    const legacy = parsed as Partial<PersistedRootPracticeStateV1>;
    const activeScheme: PracticeSchemeKey =
      legacy.activeScheme === "plus" ? "plus" : "basic";
    const legacySnapshot = normalizeSnapshot(
      {
        mainQueue: legacy.mainQueue,
        retryQueue: legacy.retryQueue,
        attempts: legacy.attempts,
        correctAttempts: legacy.correctAttempts,
        completedQuestionIds: legacy.completedQuestionIds,
        wrongOnCurrent: legacy.wrongOnCurrent,
      },
      activeScheme
    );

    return {
      version: 2,
      activeScheme,
      schemes: {
        [activeScheme]: legacySnapshot,
      },
    };
  }

  return null;
};

export default function RootPracticeTrainer({ onTopInfoChange }: RootPracticeTrainerProps) {
  const [activeScheme, setActiveScheme] = useState<PracticeSchemeKey>("basic");
  const [mainQueue, setMainQueue] = useState<RootQuestion[]>(
    () => createInitialSnapshot("basic").mainQueue
  );
  const [retryQueue, setRetryQueue] = useState<RootQuestion[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [wrongOnCurrent, setWrongOnCurrent] = useState(false);
  const [shakeTick, setShakeTick] = useState(0);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [showKeyboardChart, setShowKeyboardChart] = useState(true);
  const [feedback, setFeedback] = useState<
    | { type: "success"; message: string }
    | { type: "error"; message: string; expected: string }
    | null
  >(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const totalQuestions = useMemo(
    () => buildRootQuestions(activeScheme).length,
    [activeScheme]
  );

  const accuracy = attempts === 0 ? 0 : Math.round((correctAttempts / attempts) * 100);
  const currentQuestion = mainQueue[0] ?? null;
  const completed =
    completedSet.size >= totalQuestions && mainQueue.length === 0 && retryQueue.length === 0;
  const completedCount = completedSet.size;
  const retryCount = retryQueue.length;

  const setupRound = (scheme: PracticeSchemeKey) => {
    const questions = shuffle(buildRootQuestions(scheme));
    setMainQueue(questions);
    setRetryQueue([]);
    setInputValue("");
    setAttempts(0);
    setCorrectAttempts(0);
    setCompletedSet(new Set());
    setWrongOnCurrent(false);
    setShakeTick(0);
    setFeedback(null);
  };

  useEffect(() => {
    try {
      const persisted = normalizePersistedState();
      if (!persisted) {
        const initialSnapshot = createInitialSnapshot("basic", {
          shuffleMainQueue: true,
        });
        setActiveScheme("basic");
        setMainQueue(initialSnapshot.mainQueue);
        setRetryQueue(initialSnapshot.retryQueue);
        setAttempts(initialSnapshot.attempts);
        setCorrectAttempts(initialSnapshot.correctAttempts);
        setCompletedSet(new Set(initialSnapshot.completedQuestionIds));
        setWrongOnCurrent(initialSnapshot.wrongOnCurrent);
        return;
      }

      const scheme = persisted.activeScheme;
      const snapshot =
        persisted.schemes[scheme] ?? createInitialSnapshot(scheme, { shuffleMainQueue: true });
      setActiveScheme(scheme);
      setMainQueue(snapshot.mainQueue);
      setRetryQueue(snapshot.retryQueue);
      setAttempts(snapshot.attempts);
      setCorrectAttempts(snapshot.correctAttempts);
      setCompletedSet(new Set(snapshot.completedQuestionIds));
      setWrongOnCurrent(snapshot.wrongOnCurrent);
    } catch {
      // ignore malformed local data
    } finally {
      setIsStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isStorageReady) {
      return;
    }

    const existing = normalizePersistedState();
    const payload: PersistedRootPracticeState = {
      version: 2,
      activeScheme,
      schemes: {
        ...(existing?.schemes ?? {}),
        [activeScheme]: toSnapshotFromState({
          mainQueue,
          retryQueue,
          attempts,
          correctAttempts,
          completedSet,
          wrongOnCurrent,
        }),
      },
    };

    try {
      window.localStorage.setItem(rootPracticeStorageKey, JSON.stringify(payload));
    } catch {
      // ignore storage quota and private mode issues
    }
  }, [
    isStorageReady,
    activeScheme,
    mainQueue,
    retryQueue,
    attempts,
    correctAttempts,
    completedSet,
    wrongOnCurrent,
  ]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentQuestion]);

  useEffect(() => {
    onTopInfoChange?.({
      progress: `${completedCount}/${totalQuestions}`,
      accuracy: `${accuracy}%`,
      retry: String(retryCount),
    });
  }, [
    onTopInfoChange,
    completedCount,
    totalQuestions,
    accuracy,
    retryCount,
  ]);

  const evaluateInput = (inputKey: string) => {
    if (!currentQuestion) {
      return;
    }

    const expected = currentQuestion.key.toLowerCase();
    setAttempts((value) => value + 1);

    if (inputKey === expected) {
      const nextMain = mainQueue.slice(1);

      setCorrectAttempts((value) => value + 1);
      setCompletedSet((prev) => {
        const next = new Set(prev);
        next.add(currentQuestion.id);
        return next;
      });

      setFeedback({
        type: "success",
        message: wrongOnCurrent ? "已纠正" : "正确",
      });

      const currentNeedRetry = wrongOnCurrent;
      const nextRetry = currentNeedRetry ? [...retryQueue, currentQuestion] : retryQueue;
      if (nextMain.length === 0 && nextRetry.length > 0) {
        setMainQueue(nextRetry);
        setRetryQueue([]);
      } else {
        setMainQueue(nextMain);
        if (currentNeedRetry) {
          setRetryQueue(nextRetry);
        }
      }

      setWrongOnCurrent(false);
      setInputValue("");
      return;
    }

    setWrongOnCurrent(true);
    setShakeTick((value) => value + 1);
    setFeedback({
      type: "error",
      message: "错误",
      expected: expected.toUpperCase(),
    });
    setInputValue("");
  };

  const handleInputChange = (value: string) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      setInputValue("");
      return;
    }

    const inputKey = normalized[0];
    setInputValue(inputKey);
    evaluateInput(inputKey);
  };

  const handleSchemeSwitch = (scheme: PracticeSchemeKey) => {
    if (scheme === activeScheme) {
      return;
    }

    const existing = normalizePersistedState();
    const currentSnapshot = toSnapshotFromState({
      mainQueue,
      retryQueue,
      attempts,
      correctAttempts,
      completedSet,
      wrongOnCurrent,
    });
    const nextSchemes: PersistedRootPracticeState["schemes"] = {
      ...(existing?.schemes ?? {}),
      [activeScheme]: currentSnapshot,
    };
    const targetSnapshot =
      nextSchemes[scheme] ?? createInitialSnapshot(scheme, { shuffleMainQueue: true });

    nextSchemes[scheme] = targetSnapshot;

    try {
      window.localStorage.setItem(
        rootPracticeStorageKey,
        JSON.stringify({
          version: 2,
          activeScheme: scheme,
          schemes: nextSchemes,
        } satisfies PersistedRootPracticeState)
      );
    } catch {
      // ignore storage failures
    }

    setActiveScheme(scheme);
    setMainQueue(targetSnapshot.mainQueue);
    setRetryQueue(targetSnapshot.retryQueue);
    setAttempts(targetSnapshot.attempts);
    setCorrectAttempts(targetSnapshot.correctAttempts);
    setCompletedSet(new Set(targetSnapshot.completedQuestionIds));
    setWrongOnCurrent(targetSnapshot.wrongOnCurrent);
    setInputValue("");
    setShakeTick(0);
    setFeedback(null);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[var(--shadow-md)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">字根练习</h2>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="练习版本">
            {schemeList.map((scheme) => {
              const option = rootPracticeSchemes[scheme];
              const isActive = activeScheme === scheme;
              return (
                <button
                  key={scheme}
                  type="button"
                  onClick={() => handleSchemeSwitch(scheme)}
                  aria-pressed={isActive}
                  className={`inline-flex h-8 min-w-[5.75rem] cursor-pointer items-center justify-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                    isActive
                      ? "border-transparent text-white shadow-[var(--shadow-sm)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-slate-900"
                  }`}
                  style={isActive ? { background: option.accent } : undefined}
                >
                  {option.label}
                </button>
              );
            })}
            <button
              type="button"
              role="switch"
              aria-checked={showKeyboardChart}
              aria-label="显示或隐藏字根图"
              onClick={() => setShowKeyboardChart((value) => !value)}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-2 py-1.5 text-xs font-semibold text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-sm transition-all duration-300 hover:border-emerald-200 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              <span className="select-none">字根图</span>
              <span
                aria-hidden="true"
                className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-all duration-300 ${
                  showKeyboardChart
                    ? "border-emerald-300 bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_12px_rgba(16,185,129,0.35)]"
                    : "border-slate-300 bg-gradient-to-b from-slate-200 to-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                }`}
              >
                <span
                  className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.25),0_6px_10px_rgba(15,23,42,0.12)] transition-all duration-300 ${
                    showKeyboardChart ? "left-[1.35rem]" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
          {!isStorageReady ? (
            <div className="space-y-2">
              <div className="text-lg font-semibold text-slate-900">正在准备练习</div>
              <div className="text-sm text-slate-600">正在生成随机题目，请稍候。</div>
            </div>
          ) : !completed && currentQuestion ? (
            <>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">当前字根</div>
              <div
                key={`radical-shake-${shakeTick}`}
                className="mt-3 text-center text-6xl font-semibold leading-none text-slate-900"
                style={shakeTick > 0 ? { animation: "root-shake 320ms ease-in-out" } : undefined}
              >
                {currentQuestion.radical}
              </div>
              <div className="mx-auto mt-5 w-full max-w-[220px]">
                <label className="sr-only" htmlFor="root-practice-input">
                  输入按键
                </label>
                <input
                  ref={inputRef}
                  id="root-practice-input"
                  value={inputValue}
                  onChange={(event) => handleInputChange(event.target.value)}
                  className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-center text-lg font-semibold uppercase text-slate-700 shadow-[var(--shadow-sm)] focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="输入按键"
                  maxLength={1}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="text-lg font-semibold text-slate-900">本轮练习完成</div>
              <div className="text-sm text-slate-600">
                已完成全部字根题目，可立即开始下一轮随机练习。
              </div>
            </div>
          )}

          {feedback && !completed ? (
            <div
              className={`mt-4 rounded-xl px-3 py-2 text-sm ${
                feedback.type === "success"
                  ? "border border-emerald-300 bg-emerald-100 text-emerald-900"
                  : "border border-red-300 bg-red-100 text-red-900"
              }`}
            >
              <div className="text-center font-semibold tracking-wide">
                {feedback.message}
                {feedback.type === "error" ? (
                  <span className="ml-2 inline-flex items-center rounded-md bg-white px-2 py-0.5 text-base font-bold text-red-700 shadow-[var(--shadow-sm)]">
                    {feedback.expected}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-end gap-3 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => setupRound(activeScheme)}
            className="cursor-pointer rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-700 transition-colors duration-200 hover:border-emerald-400 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            重新开始
          </button>
        </div>
      </div>

      {showKeyboardChart ? (
        <RootKeyboardChart
          scheme={activeScheme}
          activeKey={isStorageReady ? (currentQuestion?.key ?? null) : null}
          activeRadical={isStorageReady ? (currentQuestion?.radical ?? null) : null}
        />
      ) : null}
    </section>
  );
}

