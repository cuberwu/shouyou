import type { PracticeSchemeKey } from "@/lib/practice/rootPractice";
import {
  loadPujiChaifenDictionary,
  loadSplitAuxEntries,
  pickChaifenEntryByCode,
  type ChaifenDictionary,
} from "@/lib/chaifenData";

export type SplitPracticeQuestion = {
  id: string;
  word: string;
  code: string;
  radicals: string | null;
};

type SplitPracticeCache = Partial<Record<PracticeSchemeKey, SplitPracticeQuestion[]>>;

let splitPracticeCache: SplitPracticeCache = {};
let pujiChaifenCache: ChaifenDictionary | null = null;

const ensurePujiChaifenDictionary = async (signal?: AbortSignal) => {
  if (pujiChaifenCache) {
    return pujiChaifenCache;
  }
  const dictionary = await loadPujiChaifenDictionary(signal);
  pujiChaifenCache = dictionary;
  return dictionary;
};

const buildSplitPracticeQuestions = async (
  scheme: PracticeSchemeKey,
  signal?: AbortSignal
): Promise<SplitPracticeQuestion[]> => {
  const [auxEntries, pujiDictionary] = await Promise.all([
    loadSplitAuxEntries(scheme, signal),
    ensurePujiChaifenDictionary(signal),
  ]);

  return auxEntries.map((entry, index) => {
    const chaifenEntries = pujiDictionary[entry.word] ?? [];
    const matched = pickChaifenEntryByCode(chaifenEntries, entry.code);

    return {
      id: `${scheme}-${index}-${entry.word}-${entry.code}`,
      word: entry.word,
      code: entry.code,
      radicals: scheme === "basic" ? (matched?.radicals ?? null) : null,
    };
  });
};

export const loadSplitPracticeQuestions = async (
  scheme: PracticeSchemeKey,
  signal?: AbortSignal
): Promise<SplitPracticeQuestion[]> => {
  const cached = splitPracticeCache[scheme];
  if (cached) {
    return cached;
  }

  const questions = await buildSplitPracticeQuestions(scheme, signal);
  splitPracticeCache = {
    ...splitPracticeCache,
    [scheme]: questions,
  };

  return questions;
};

export const clearSplitPracticeCache = () => {
  splitPracticeCache = {};
  pujiChaifenCache = null;
};

