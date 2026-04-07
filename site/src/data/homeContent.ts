import homeContentJson from "../../resources/home-content.json";

export type HomeAction = {
  href: string;
  label: string;
};

export type HomeHeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  primaryAction: HomeAction;
  secondaryAction: HomeAction;
  meta: string[];
};

export type HomeVersionsSection = {
  title: string;
  description: string;
  items: Array<{
    name: string;
    tag: string;
    accent: string;
    badge: string;
    points: string[];
  }>;
};

export type HomeComparisonSection = {
  title: string;
  description: string;
  rows: Array<{
    dimension: string;
    pinyin: string;
    other: string;
    shouyou: string;
  }>;
  highlight: {
    title: string;
    description: string;
    points: string[];
  };
};

export type HomeFeaturesSection = {
  title: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
    highlight: string;
  }>;
};

export type HomeLearningPathSection = {
  title: string;
  description: string;
  steps: Array<{
    title: string;
    description: string;
  }>;
};

export type HomeContent = {
  hero: HomeHeroContent;
  versions: HomeVersionsSection;
  comparison: HomeComparisonSection;
  features: HomeFeaturesSection;
  learningPath: HomeLearningPathSection;
};

export const homeContent = homeContentJson as HomeContent;
