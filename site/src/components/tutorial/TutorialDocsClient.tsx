"use client";

import { useState } from "react";

import MarkdownContent from "@/components/tutorial/MarkdownContent";
import TutorialDocDirectory from "@/components/tutorial/TutorialDocDirectory";

type DocSummary = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  searchText: string;
  content: string;
  headings: {
    id: string;
    text: string;
    level: number;
  }[];
};

type Props = {
  docs: DocSummary[];
  categories: string[];
  overviewContent: string;
};


export default function TutorialDocsClient({
  docs,
  categories,
  overviewContent,
}: Props) {
  const [keyword, setKeyword] = useState("");

  return (
    <main className="mx-auto flex w-full max-w-[88rem] flex-col gap-8 px-8 pb-20 pt-12 xl:px-12">
      <section className="grid gap-8 lg:grid-cols-[15.5rem_minmax(0,1fr)] xl:gap-10">
        <TutorialDocDirectory
          docs={docs}
          categories={categories}
          keyword={keyword}
          onKeywordChange={setKeyword}
        />

        <section className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[var(--shadow-sm)]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-700">
            <span className="rounded-full bg-emerald-100 px-2 py-0.5">总览导读</span>
            <span className="ml-auto text-slate-400">首页文档</span>
          </div>
          <div className="mt-4">
            <MarkdownContent content={overviewContent} />
          </div>
        </section>

      </section>
    </main>
  );
}
