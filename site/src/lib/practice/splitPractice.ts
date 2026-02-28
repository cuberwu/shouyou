import type { PracticeSchemeKey } from "@/lib/practice/rootPractice";
import {
  loadPlusChaifenDictionary,
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
let plusChaifenCache: ChaifenDictionary | null = null;

const ensurePujiChaifenDictionary = async (signal?: AbortSignal) => {
  if (pujiChaifenCache) {
    return pujiChaifenCache;
  }
  const dictionary = await loadPujiChaifenDictionary(signal);
  pujiChaifenCache = dictionary;
  return dictionary;
};

const ensurePlusChaifenDictionary = async (signal?: AbortSignal) => {
  if (plusChaifenCache) {
    return plusChaifenCache;
  }
  const dictionary = await loadPlusChaifenDictionary(signal);
  plusChaifenCache = dictionary;
  return dictionary;
};

const buildSplitPracticeQuestions = async (
  scheme: PracticeSchemeKey,
  signal?: AbortSignal
): Promise<SplitPracticeQuestion[]> => {
  const [auxEntries, dictionary] = await Promise.all([
    loadSplitAuxEntries(scheme, signal),
    scheme === "basic" ? ensurePujiChaifenDictionary(signal) : ensurePlusChaifenDictionary(signal),
  ]);

  return auxEntries.map((entry, index) => {
    const chaifenEntries = dictionary[entry.word] ?? [];
    const matched = pickChaifenEntryByCode(chaifenEntries, entry.code);

    return {
      id: `${scheme}-${index}-${entry.word}-${entry.code}`,
      word: entry.word,
      code: entry.code,
      radicals: matched?.radicals ?? null,
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
  plusChaifenCache = null;
};

