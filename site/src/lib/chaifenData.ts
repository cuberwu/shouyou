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

const pujiChaifenDictionaryUrl = new URL(
  "../../resources/puji_chaifen.dict.yaml",
  import.meta.url
).toString();

const plusChaifenDictionaryUrl = new URL(
  "../../resources/plus_chaifen.dict.yaml",
  import.meta.url
).toString();

const splitAuxDictionaryUrls: Record<PracticeSchemeKey, string> = {
  basic: new URL("../../resources/前1500字_普及版辅助码.txt", import.meta.url).toString(),
  plus: new URL("../../resources/前1500字_plus辅助码.txt", import.meta.url).toString(),
};

const fetchTextResource = async (url: string, signal?: AbortSignal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`码表读取失败 (${response.status})`);
  }
  return response.text();
};

export const normalizeRadicals = (value: string) =>
  Array.from(value).filter((item) => item.trim().length > 0);

export const formatRadicals = (value: string) => normalizeRadicals(value).join(" ");

export const filterLookupQuery = (value: string) =>
  Array.from(value)
    .filter((char) => /\p{Script=Han}/u.test(char))
    .join("");

export const parseChaifenYaml = (content: string): ChaifenDictionary => {
  const dictionary: ChaifenDictionary = {};
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (
      trimmed.length === 0 ||
      trimmed.startsWith("#") ||
      trimmed === "---" ||
      trimmed === "..."
    ) {
      continue;
    }

    const parts = trimmed.split(/\t+/);
    if (parts.length < 2) {
      continue;
    }

    const word = parts[0].trim();
    const rawPayload = parts.slice(1).join("").trim();
    if (!word || !rawPayload) {
      continue;
    }

    const cleanedPayload = rawPayload.replace(/\s+/g, "").replace(/[^a-z]+$/i, "");
    const match = cleanedPayload.match(/^(.*?)([a-z]+)$/i);
    if (!match) {
      continue;
    }

    const radicals = match[1].trim();
    const code = match[2].toLowerCase();

    if (!radicals || !code) {
      continue;
    }

    const entry: ChaifenEntry = { word, radicals, code };
    if (!dictionary[word]) {
      dictionary[word] = [];
    }
    dictionary[word].push(entry);
  }

  return dictionary;
};

export const parseSplitAuxText = (content: string): SplitAuxEntry[] => {
  const result: SplitAuxEntry[] = [];
  const seen = new Set<string>();
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.replace(/^\uFEFF/, "").trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) {
      continue;
    }

    const word = Array.from(parts[0].trim())[0] ?? "";
    const code = parts[1].trim().toLowerCase();

    if (!word || !/\p{Script=Han}/u.test(word)) {
      continue;
    }

    if (!/^[a-z]{2,}$/i.test(code)) {
      continue;
    }

    const normalizedCode = code.slice(0, 2);
    const uniqueKey = `${word}-${normalizedCode}`;
    if (seen.has(uniqueKey)) {
      continue;
    }

    seen.add(uniqueKey);
    result.push({
      word,
      code: normalizedCode,
    });
  }

  return result;
};

export const pickChaifenEntryByCode = (
  entries: ChaifenEntry[],
  expectedCode: string
): ChaifenEntry | null => {
  if (entries.length === 0) {
    return null;
  }

  const normalizedCode = expectedCode.toLowerCase();
  return entries.find((entry) => entry.code === normalizedCode) ?? entries[0] ?? null;
};

export const loadPujiChaifenDictionary = async (
  signal?: AbortSignal
): Promise<ChaifenDictionary> => {
  const content = await fetchTextResource(pujiChaifenDictionaryUrl, signal);
  return parseChaifenYaml(content);
};

export const loadPlusChaifenDictionary = async (
  signal?: AbortSignal
): Promise<ChaifenDictionary> => {
  const content = await fetchTextResource(plusChaifenDictionaryUrl, signal);
  return parseChaifenYaml(content);
};

export const loadSplitAuxEntries = async (
  scheme: PracticeSchemeKey,
  signal?: AbortSignal
): Promise<SplitAuxEntry[]> => {
  const content = await fetchTextResource(splitAuxDictionaryUrls[scheme], signal);
  return parseSplitAuxText(content);
};

