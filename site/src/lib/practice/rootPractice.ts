export type PracticeSchemeKey = "basic" | "plus";

export type RootKeyMapping = {
  key: string;
  radicals: string[];
  display: string;
};

export type RootPracticeScheme = {
  key: PracticeSchemeKey;
  label: string;
  accent: string;
  description: string;
  mappings: RootKeyMapping[];
};

export type RootQuestion = {
  id: string;
  key: string;
  radical: string;
};

const splitRadicals = (value: string) =>
  Array.from(value).filter((char) => char.trim().length > 0);

const toMappings = (entries: Array<[string, string]>): RootKeyMapping[] =>
  entries.map(([key, roots]) => {
    const radicals = splitRadicals(roots);
    return {
      key: key.toUpperCase(),
      radicals,
      display: radicals.join(" "),
    };
  });

const basicMappings = toMappings([
  ["Q", "火"],
  ["W", "王"],
  ["E", "禾"],
  ["R", "亻"],
  ["T", "土"],
  ["Y", "月"],
  ["U", "氵水"],
  ["I", "纟"],
  ["O", "虫"],
  ["P", "撇"],
  ["A", "讠言"],
  ["S", "竖"],
  ["D", "点"],
  ["F", "扌手"],
  ["G", "竹辶"],
  ["H", "横"],
  ["J", "钅金"],
  ["K", "口"],
  ["L", "日"],
  ["Z", "⻊足"],
  ["X", "忄心"],
  ["C", "艹"],
  ["V", "折"],
  ["B", "宀"],
  ["N", "女"],
  ["M", "木"],
]);

const plusMappings = toMappings([
  ["Q", "火龶"],
  ["W", "王亠攵"],
  ["E", "禾阝"],
  ["R", "亻彳"],
  ["T", "土田"],
  ["Y", "月又雨"],
  ["U", "氵"],
  ["I", "纟厶"],
  ["O", "虫刂"],
  ["P", "撇"],
  ["A", "讠"],
  ["S", "竖西饣尸"],
  ["D", "点"],
  ["F", "扌十"],
  ["G", "竹辶弓山⺈"],
  ["H", "横"],
  ["J", "钅几巾"],
  ["K", "口"],
  ["L", "日力大目"],
  ["Z", "⻊子疒"],
  ["X", "忄小彐广"],
  ["C", "艹车乂寸"],
  ["V", "折舟犭"],
  ["B", "宀贝勹八石"],
  ["N", "女鸟"],
  ["M", "木门"],
]);

export const rootPracticeSchemes: Record<PracticeSchemeKey, RootPracticeScheme> = {
  basic: {
    key: "basic",
    label: "普及版",
    accent: "var(--color-primary)",
    description: "核心字根，适合初学者建立键位记忆。",
    mappings: basicMappings,
  },
  plus: {
    key: "plus",
    label: "Plus 版",
    accent: "var(--color-plus)",
    description: "字根更完整，适合进阶强化练习。",
    mappings: plusMappings,
  },
};

export const rootKeyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
] as const;

export const buildRootQuestions = (schemeKey: PracticeSchemeKey): RootQuestion[] =>
  rootPracticeSchemes[schemeKey].mappings.flatMap((mapping, mappingIndex) =>
    mapping.radicals.map((radical, radicalIndex) => ({
      id: `${schemeKey}-${mappingIndex}-${radicalIndex}-${mapping.key}-${radical}`,
      key: mapping.key.toLowerCase(),
      radical,
    }))
  );

