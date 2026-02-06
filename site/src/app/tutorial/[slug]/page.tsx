import Link from "next/link";

import TutorialDocDetailLayout from "@/components/tutorial/TutorialDocDetailLayout";
import MarkdownContent from "@/components/tutorial/MarkdownContent";
import TutorialDocDirectory from "@/components/tutorial/TutorialDocDirectory";
import TutorialSideActions from "@/components/tutorial/TutorialSideActions";
import { categoryOrder, getAllDocs, getDocBySlug, getDocSlugs } from "@/lib/docs";

export const dynamicParams = false;

export const generateStaticParams = () =>
  getDocSlugs().map((slug) => ({ slug }));

export default async function TutorialDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  const docs = getAllDocs();

  if (!doc) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-[var(--shadow-sm)]">
          <h1 className="text-2xl font-semibold text-slate-900">未找到对应文档</h1>
          <p className="mt-2 text-sm text-slate-600">
            请返回文档中心重新选择。
          </p>
          <Link
            href="/tutorial"
            className="mt-6 inline-flex cursor-pointer rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
          >
            返回文档中心
          </Link>
        </div>
      </main>
    );
  }

  const currentIndex = docs.findIndex((item) => item.slug === doc.slug);
  const previousDoc = currentIndex > 0 ? docs[currentIndex - 1] : null;
  const nextDoc =
    currentIndex >= 0 && currentIndex < docs.length - 1
      ? docs[currentIndex + 1]
      : null;

  return (
    <main
      id="top"
      className="mx-auto flex w-full max-w-[88rem] flex-col gap-8 px-8 pb-20 pt-12 xl:px-12"
    >
      <TutorialDocDetailLayout
        left={
          <TutorialDocDirectory
            docs={docs}
            categories={categoryOrder}
            activeSlug={doc.slug}
          />
        }
        center={
          <section className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[var(--shadow-sm)]">
          <MarkdownContent content={doc.content} />

          <footer className="mt-10 border-t border-slate-200 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {previousDoc ? (
                <Link
                  href={`/tutorial/${previousDoc.slug}`}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors duration-200 hover:border-emerald-300 hover:text-emerald-800"
                >
                  ← 上一篇
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-400">
                  ← 上一篇
                </span>
              )}

              <Link
                href="/tutorial"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-emerald-300 hover:text-emerald-800"
              >
                返回教程首页
              </Link>

              {nextDoc ? (
                <Link
                  href={`/tutorial/${nextDoc.slug}`}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors duration-200 hover:border-emerald-300 hover:text-emerald-800"
                >
                  下一篇 →
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-400">
                  下一篇 →
                </span>
              )}
            </div>
          </footer>
          </section>
        }
        right={
          <TutorialSideActions headings={doc.headings} />
        }
      />
    </main>
  );
}
