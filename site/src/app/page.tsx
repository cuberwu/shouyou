import HomeComparison from "@/components/home/HomeComparison";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeHero from "@/components/home/HomeHero";
import HomeLearningPath from "@/components/home/HomeLearningPath";
import HomeVersions from "@/components/home/HomeVersions";
import { homeContent } from "@/data/homeContent";

export default function HomePage() {
  return (
    <main className="page-shell">
      <HomeHero content={homeContent.hero} />
      <HomeVersions content={homeContent.versions} />
      <HomeComparison content={homeContent.comparison} />
      <HomeFeatures content={homeContent.features} />
      <HomeLearningPath content={homeContent.learningPath} />
    </main>
  );
}
