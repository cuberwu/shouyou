import type { PracticeSchemeKey } from "@/lib/practice/rootPractice";
import {
  loadPlusChaifenDictionary,
  loadPujiChaifenDictionary,
  loadSplitAuxEntries,
  pickChaifenEntryByCode,
} from "@/lib/chaifenData";

export type SplitPracticeQuestion = {
  id: string;
  word: string;
  code: string;
  radicals: string | null;
};

let splitPracticeCache: Partial<Record<PracticeSchemeKey, Promise<SplitPracticeQuestion[]>>> = {};

async function buildSplitPracticeQuestions(
  scheme: PracticeSchemeKey
): Promise<SplitPracticeQuestion[]> {
  const [auxEntries, dictionary] = await Promise.all([
    loadSplitAuxEntries(scheme),
    scheme === "basic" ? loadPujiChaifenDictionary() : loadPlusChaifenDictionary(),
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
}

export async function loadSplitPracticeQuestions(
  scheme: PracticeSchemeKey
): Promise<SplitPracticeQuestion[]> {
  const cached = splitPracticeCache[scheme];
  if (cached) {
    return cached;
  }

  const questions = buildSplitPracticeQuestions(scheme);
  splitPracticeCache = {
    ...splitPracticeCache,
    [scheme]: questions,
  };

  return questions;
}

export function clearSplitPracticeCache() {
  splitPracticeCache = {};
}

