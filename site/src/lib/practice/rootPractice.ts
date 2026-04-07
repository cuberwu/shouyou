import rootSchemesJson from "../../../resources/root-schemes.json";

export type PracticeSchemeKey = "basic" | "plus";

type RootSchemeResource = {
  schemeOrder: PracticeSchemeKey[];
  keyboardRows: string[][];
  schemes: Record<
    PracticeSchemeKey,
    {
      key: PracticeSchemeKey;
      label: string;
      accent: string;
      description: string;
      mappings: Array<{
        key: string;
        radicals: string[];
      }>;
    }
  >;
};

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

const rootSchemeResource = rootSchemesJson as RootSchemeResource;

function toMappings(
  mappings: RootSchemeResource["schemes"][PracticeSchemeKey]["mappings"]
): RootKeyMapping[] {
  return mappings.map((mapping) => ({
    key: mapping.key.toUpperCase(),
    radicals: mapping.radicals,
    display: mapping.radicals.join(" "),
  }));
}

export const practiceSchemeOrder = rootSchemeResource.schemeOrder;

export const rootPracticeSchemes: Record<PracticeSchemeKey, RootPracticeScheme> = {
  basic: {
    ...rootSchemeResource.schemes.basic,
    mappings: toMappings(rootSchemeResource.schemes.basic.mappings),
  },
  plus: {
    ...rootSchemeResource.schemes.plus,
    mappings: toMappings(rootSchemeResource.schemes.plus.mappings),
  },
};

export const rootKeyboardRows = rootSchemeResource.keyboardRows;

const rootChartRowsByScheme = practiceSchemeOrder.reduce(
  (result, scheme) => {
    const mappingLookup = new Map(
      rootPracticeSchemes[scheme].mappings.map((mapping) => [mapping.key, mapping])
    );

    result[scheme] = rootKeyboardRows.map((row) =>
      row.map((key) => mappingLookup.get(key)).filter((item): item is RootKeyMapping => !!item)
    );

    return result;
  },
  {} as Record<PracticeSchemeKey, RootKeyMapping[][]>
);

export function getRootChartRows(schemeKey: PracticeSchemeKey): RootKeyMapping[][] {
  return rootChartRowsByScheme[schemeKey];
}

export function buildRootQuestions(schemeKey: PracticeSchemeKey): RootQuestion[] {
  return rootPracticeSchemes[schemeKey].mappings.flatMap((mapping, mappingIndex) =>
    mapping.radicals.map((radical, radicalIndex) => ({
      id: `${schemeKey}-${mappingIndex}-${radicalIndex}-${mapping.key}-${radical}`,
      key: mapping.key.toLowerCase(),
      radical,
    }))
  );
}
