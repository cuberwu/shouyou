"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  StrokeGifButton,
  StrokeGifPanel,
  useStrokeGif,
} from "@/components/StrokeGif";
import { formatRadicals } from "@/lib/chaifenData";
import {
  loadSplitPracticeQuestions,
  type SplitPracticeQuestion,
} from "@/lib/practice/splitPractice";
import {
  rootPracticeSchemes,
  type PracticeSchemeKey,
} from "@/lib/practice/rootPractice";

const shuffle = <T,>(source: T[]) => {
  const array = [...source];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const splitPracticeStorageKey = "shouyou.practice.split.v1";
const schemeList: PracticeSchemeKey[] = ["basic", "plus"];

export type SplitPracticeTopInfo = {
  progress: string;
  accuracy: string;
  retry: string;
};

type SplitPracticeTrainerProps = {
  onTopInfoChange?: (info: SplitPracticeTopInfo) => void;
};

type SchemeProgressSnapshot = {
  mainQueue: SplitPracticeQuestion[];
  retryQueue: SplitPracticeQuestion[];
  attempts: number;
  correctAttempts: number;
  completedQuestionIds: string[];
  wrongOnCurrent: boolean;
};

type PersistedSplitPracticeState = {
  version: 1;
  activeScheme: PracticeSchemeKey;
  schemes: Partial<Record<PracticeSchemeKey, SchemeProgressSnapshot>>;
};

const toSnapshotFromState = (params: {
  mainQueue: SplitPracticeQuestion[];
  retryQueue: SplitPracticeQuestion[];
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
  questions: SplitPracticeQuestion[],
  options?: {
    shuffleMainQueue?: boolean;
  }
): SchemeProgressSnapshot => ({
  mainQueue: options?.shuffleMainQueue ? shuffle(questions) : questions,
  retryQueue: [],
  attempts: 0,
  correctAttempts: 0,
  completedQuestionIds: [],
  wrongOnCurrent: false,
});

const isSplitPracticeQuestion = (value: unknown): value is SplitPracticeQuestion => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SplitPracticeQuestion>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.word === "string" &&
    typeof candidate.code === "string" &&
    (candidate.radicals === null || typeof candidate.radicals === "string")
  );
};

const normalizeSnapshot = (
  value: unknown,
  questions: SplitPracticeQuestion[]
): SchemeProgressSnapshot => {
  const initial = createInitialSnapshot(questions);
  if (!value || typeof value !== "object") {
    return initial;
  }

  const source = value as Partial<SchemeProgressSnapshot>;

  return {
    mainQueue:
      Array.isArray(source.mainQueue) && source.mainQueue.every(isSplitPracticeQuestion)
        ? source.mainQueue
        : initial.mainQueue,
    retryQueue:
      Array.isArray(source.retryQueue) && source.retryQueue.every(isSplitPracticeQuestion)
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

const readPersistedState = (): PersistedSplitPracticeState | null => {
  const raw = window.localStorage.getItem(splitPracticeStorageKey);
  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const data = parsed as Partial<PersistedSplitPracticeState>;
  if (data.version !== 1) {
    return null;
  }

  return {
    version: 1,
    activeScheme: data.activeScheme === "plus" ? "plus" : "basic",
    schemes:
      data.schemes && typeof data.schemes === "object"
        ? data.schemes
        : {},
  };
};

export default function SplitPracticeTrainer({ onTopInfoChange }: SplitPracticeTrainerProps) {
  const [activeScheme, setActiveScheme] = useState<PracticeSchemeKey>("basic");
  const [questionBankByScheme, setQuestionBankByScheme] = useState<
    Partial<Record<PracticeSchemeKey, SplitPracticeQuestion[]>>
  >({});
  const [mainQueue, setMainQueue] = useState<SplitPracticeQuestion[]>([]);
  const [retryQueue, setRetryQueue] = useState<SplitPracticeQuestion[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [wrongOnCurrent, setWrongOnCurrent] = useState(false);
  const [shakeTick, setShakeTick] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isHintHovering, setIsHintHovering] = useState(false);
  const [isHintPinned, setIsHintPinned] = useState(false);
  const [feedback, setFeedback] = useState<
    | { type: "success"; message: string }
    | { type: "error"; message: string; expected: string }
    | null
  >(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const activeQuestionBank = questionBankByScheme[activeScheme] ?? [];
  const totalQuestions = activeQuestionBank.length;

  const accuracy = attempts === 0 ? 0 : Math.round((correctAttempts / attempts) * 100);
  const currentQuestion = mainQueue[0] ?? null;
  const completed =
    totalQuestions > 0 &&
    completedSet.size >= totalQuestions &&
    mainQueue.length === 0 &&
    retryQueue.length === 0;
  const completedCount = completedSet.size;
  const retryCount = retryQueue.length;

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const bootstrap = async () => {
      setIsReady(false);
      setLoadError(null);

      try {
        const [basicQuestions, plusQuestions] = await Promise.all([
          loadSplitPracticeQuestions("basic", controller.signal),
          loadSplitPracticeQuestions("plus", controller.signal),
        ]);

        if (!isActive) {
          return;
        }

        const banks: Partial<Record<PracticeSchemeKey, SplitPracticeQuestion[]>> = {
          basic: basicQuestions,
          plus: plusQuestions,
        };

        setQuestionBankByScheme(banks);

        const persisted = readPersistedState();
        const nextActiveScheme = persisted?.activeScheme ?? "basic";

        const initialQuestions = banks[nextActiveScheme] ?? [];
        const persistedSnapshot = persisted?.schemes[nextActiveScheme];
        const normalizedSnapshot = normalizeSnapshot(persistedSnapshot, initialQuestions);

        setActiveScheme(nextActiveScheme);
        setMainQueue(normalizedSnapshot.mainQueue);
        setRetryQueue(normalizedSnapshot.retryQueue);
        setAttempts(normalizedSnapshot.attempts);
        setCorrectAttempts(normalizedSnapshot.correctAttempts);
        setCompletedSet(new Set(normalizedSnapshot.completedQuestionIds));
        setWrongOnCurrent(normalizedSnapshot.wrongOnCurrent);
        setInputValue("");
        setFeedback(null);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setLoadError(error instanceof Error ? error.message : "练习数据读取失败");
      } finally {
        if (isActive) {
          setIsReady(true);
        }
      }
    };

    bootstrap();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!isReady || totalQuestions === 0) {
      return;
    }

    const existing = readPersistedState();
    const payload: PersistedSplitPracticeState = {
      version: 1,
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
      window.localStorage.setItem(splitPracticeStorageKey, JSON.stringify(payload));
    } catch {
      // ignore storage quota and private mode issues
    }
  }, [
    isReady,
    totalQuestions,
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
      progress: totalQuestions > 0 ? `${completedCount}/${totalQuestions}` : "--",
      accuracy: `${accuracy}%`,
      retry: String(retryCount),
    });
  }, [onTopInfoChange, completedCount, totalQuestions, accuracy, retryCount]);

  const setupRound = (scheme: PracticeSchemeKey) => {
    const questions = questionBankByScheme[scheme] ?? [];
    const snapshot = createInitialSnapshot(questions, { shuffleMainQueue: true });
    setMainQueue(snapshot.mainQueue);
    setRetryQueue(snapshot.retryQueue);
    setInputValue("");
    setAttempts(0);
    setCorrectAttempts(0);
    setCompletedSet(new Set());
    setWrongOnCurrent(false);
    setShakeTick(0);
    setIsHintHovering(false);
    setFeedback(null);
  };

  const evaluateInput = (value: string) => {
    if (!currentQuestion) {
      return;
    }

    const expected = currentQuestion.code.toLowerCase();
    setAttempts((prev) => prev + 1);

    if (value === expected) {
      const nextMain = mainQueue.slice(1);

      setCorrectAttempts((prev) => prev + 1);
      setCompletedSet((prev) => {
        const next = new Set(prev);
        next.add(currentQuestion.id);
        return next;
      });

      setFeedback({
        type: "success",
        message: wrongOnCurrent ? "已纠正" : "正确",
      });

      const needRetry = wrongOnCurrent;
      const nextRetry = needRetry ? [...retryQueue, currentQuestion] : retryQueue;

      if (nextMain.length === 0 && nextRetry.length > 0) {
        setMainQueue(nextRetry);
        setRetryQueue([]);
      } else {
        setMainQueue(nextMain);
        if (needRetry) {
          setRetryQueue(nextRetry);
        }
      }

      setWrongOnCurrent(false);
      setInputValue("");
      return;
    }

    setWrongOnCurrent(true);
    setShakeTick((prev) => prev + 1);
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

    const next = normalized.slice(0, 2);
    setInputValue(next);
    if (next.length === 2) {
      evaluateInput(next);
    }
  };

  const handleSchemeSwitch = (scheme: PracticeSchemeKey) => {
    if (scheme === activeScheme) {
      return;
    }

    const existing = readPersistedState();

    const currentSnapshot = toSnapshotFromState({
      mainQueue,
      retryQueue,
      attempts,
      correctAttempts,
      completedSet,
      wrongOnCurrent,
    });

    const nextSchemes: PersistedSplitPracticeState["schemes"] = {
      ...(existing?.schemes ?? {}),
      [activeScheme]: currentSnapshot,
    };

    const targetQuestions = questionBankByScheme[scheme] ?? [];
    const targetSnapshot = normalizeSnapshot(nextSchemes[scheme], targetQuestions);
    nextSchemes[scheme] = targetSnapshot;

    try {
      window.localStorage.setItem(
        splitPracticeStorageKey,
        JSON.stringify({
          version: 1,
          activeScheme: scheme,
          schemes: nextSchemes,
        } satisfies PersistedSplitPracticeState)
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
    setIsHintHovering(false);
    setFeedback(null);
  };

  const splitHint = useMemo(() => {
    if (!currentQuestion) {
      return "--";
    }

    if (activeScheme === "plus") {
      return "数据准备中";
    }

    return currentQuestion.radicals ? formatRadicals(currentQuestion.radicals) : "未找到拆分";
  }, [activeScheme, currentQuestion]);

  const {
    isExpanded: isStrokeGifExpanded,
    toggleExpanded: toggleStrokeGifExpanded,
    gifUrl: strokeGifUrl,
    loadState: strokeGifLoadState,
    onLoad: handleStrokeGifLoad,
    onError: handleStrokeGifError,
  } = useStrokeGif(currentQuestion?.word ?? "", currentQuestion?.id ?? "");

  const isHintVisible = isHintPinned || isHintHovering;

  const handleHintToggle = () => {
    setIsHintPinned((value) => !value);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[var(--shadow-md)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">拆分练习</h2>
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
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
          {!isReady ? (
            <div className="space-y-2">
              <div className="text-lg font-semibold text-slate-900">正在准备练习</div>
              <div className="text-sm text-slate-600">正在读取拆分题目，请稍候。</div>
            </div>
          ) : loadError ? (
            <div className="space-y-2">
              <div className="text-lg font-semibold text-slate-900">练习数据加载失败</div>
              <div className="text-sm text-amber-700">{loadError}</div>
            </div>
          ) : totalQuestions === 0 ? (
            <div className="space-y-2">
              <div className="text-lg font-semibold text-slate-900">暂无题目</div>
              <div className="text-sm text-slate-600">当前版本暂未提供可用拆分练习数据。</div>
            </div>
          ) : !completed && currentQuestion ? (
            <>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">当前汉字</div>
              <div
                className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/30"
                onMouseEnter={() => setIsHintHovering(true)}
                onMouseLeave={() => setIsHintHovering(false)}
              >
                <div className="relative flex h-44 w-full items-center justify-center px-4 py-4">
                  <div
                    key={`split-shake-${shakeTick}`}
                    className="text-center text-6xl font-semibold leading-none text-slate-900"
                    style={
                      shakeTick > 0 ? { animation: "root-shake 320ms ease-in-out" } : undefined
                    }
                  >
                    {currentQuestion.word}
                  </div>
                </div>

                <div className="px-3 pb-3">
                  <div className="w-full rounded-xl border border-emerald-200 bg-white/95 text-emerald-800 shadow-[var(--shadow-sm)]">
                    <div className="flex items-center justify-between px-4 py-2">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                        拆分提示
                      </div>
                      <div className="flex items-center gap-2">
                        <StrokeGifButton
                          isExpanded={isStrokeGifExpanded}
                          onToggle={toggleStrokeGifExpanded}
                          label="笔顺"
                        />
                        <button
                          type="button"
                          aria-label={isHintPinned ? "取消钉住提示" : "钉住提示"}
                          onClick={handleHintToggle}
                          className={`inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                            isHintPinned
                              ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                              : "border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:text-emerald-700"
                          }`}
                        >
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
                            <path d="M8 4h8" />
                            <path d="M9 4v5l-3 3v2h12v-2l-3-3V4" />
                            <path d="M12 14v6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                        isHintVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <StrokeGifPanel
                          char={currentQuestion.word}
                          isExpanded={isStrokeGifExpanded}
                          gifUrl={strokeGifUrl}
                          loadState={strokeGifLoadState}
                          onLoad={handleStrokeGifLoad}
                          onError={handleStrokeGifError}
                          className="px-4"
                        />
                        <div className="px-4 pb-3 text-center text-base font-semibold">{splitHint}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                悬浮/点击显示提示
              </div>

              <div className="mx-auto mt-5 w-full max-w-[240px]">
                <label className="sr-only" htmlFor="split-practice-input">
                  输入辅助码
                </label>
                <input
                  ref={inputRef}
                  id="split-practice-input"
                  value={inputValue}
                  onChange={(event) => handleInputChange(event.target.value)}
                  className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-center text-lg font-semibold uppercase tracking-[0.08em] text-slate-700 shadow-[var(--shadow-sm)] focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="输入2位辅助码"
                  maxLength={2}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2 animate-fade-in">
              <div className="text-lg font-semibold text-slate-900">本轮练习完成</div>
              <div className="text-sm text-slate-600">
                已完成全部拆分题目，可立即开始下一轮随机练习。
              </div>
            </div>
          )}

          {feedback && !completed ? (
            <div
              key={`feedback-${attempts}`}
              className={`mt-4 rounded-xl px-3 py-2 text-sm animate-fade-in ${
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
            disabled={!isReady || !!loadError || totalQuestions === 0}
            className="cursor-pointer rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-700 transition-colors duration-200 hover:border-emerald-400 hover:text-emerald-800 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            重新开始
          </button>
        </div>
      </div>
    </section>
  );
}

