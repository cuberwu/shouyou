import type { PracticeSchemeKey } from "@/lib/practice/rootPractice";

export type ChaifenEntry = {
  word: string;
  radicals: string;
  code: string;
};

export type ChaifenDictionary = Record<string, ChaifenEntry[]>;

export type SplitAuxEntry = {
  word: string;
  code: string;
};

type JsonModule<T> = {
  default: T;
};

const chaifenLoaders: Record<
  PracticeSchemeKey,
  () => Promise<JsonModule<ChaifenDictionary>>
> = {
  basic: () => import("../../resources/chaifen.basic.json"),
  plus: () => import("../../resources/chaifen.plus.json"),
};

const splitAuxLoaders: Record<
  PracticeSchemeKey,
  () => Promise<JsonModule<SplitAuxEntry[]>>
> = {
  basic: () => import("../../resources/split-aux.basic.json"),
  plus: () => import("../../resources/split-aux.plus.json"),
};

const chaifenCache: Partial<Record<PracticeSchemeKey, Promise<ChaifenDictionary>>> = {};
const splitAuxCache: Partial<Record<PracticeSchemeKey, Promise<SplitAuxEntry[]>>> = {};

export function normalizeRadicals(value: string): string[] {
  return Array.from(value).filter((item) => item.trim().length > 0);
}

export function formatRadicals(value: string): string {
  return normalizeRadicals(value).join(" ");
}

export function filterLookupQuery(value: string): string {
  return Array.from(value)
    .filter((char) => /\p{Script=Han}/u.test(char))
    .join("");
}

export function pickChaifenEntryByCode(
  entries: ChaifenEntry[],
  expectedCode: string
): ChaifenEntry | null {
  if (entries.length === 0) {
    return null;
  }

  const normalizedCode = expectedCode.toLowerCase();
  return entries.find((entry) => entry.code === normalizedCode) ?? entries[0] ?? null;
}

async function loadChaifenDictionary(scheme: PracticeSchemeKey): Promise<ChaifenDictionary> {
  const cached = chaifenCache[scheme];
  if (cached) {
    return cached;
  }

  const nextValue = chaifenLoaders[scheme]().then((module) => module.default);
  chaifenCache[scheme] = nextValue;
  return nextValue;
}

export function loadPujiChaifenDictionary(): Promise<ChaifenDictionary> {
  return loadChaifenDictionary("basic");
}

export function loadPlusChaifenDictionary(): Promise<ChaifenDictionary> {
  return loadChaifenDictionary("plus");
}

export async function loadSplitAuxEntries(
  scheme: PracticeSchemeKey
): Promise<SplitAuxEntry[]> {
  const cached = splitAuxCache[scheme];
  if (cached) {
    return cached;
  }

  const nextValue = splitAuxLoaders[scheme]().then((module) => module.default);
  splitAuxCache[scheme] = nextValue;
  return nextValue;
}
