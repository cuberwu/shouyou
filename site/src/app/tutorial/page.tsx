import {
  categoryOrder,
  getAllDocSummaries,
  getTutorialOverviewContent,
} from "@/lib/docs";
import TutorialDocsClient from "@/components/tutorial/TutorialDocsClient";

export default function TutorialPage() {
  const docs = getAllDocSummaries();
  const overviewContent = getTutorialOverviewContent();

  return (
    <TutorialDocsClient
      docs={docs}
      categories={categoryOrder}
      overviewContent={overviewContent}
    />
  );
}
