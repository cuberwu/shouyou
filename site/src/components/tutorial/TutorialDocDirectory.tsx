"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";

type DocHeading = {
  id: string;
  text: string;
  level: number;
};

type DirectoryDoc = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  searchText: string;
  content: string;
  headings: DocHeading[];
};

type SearchResult = {
  id: string;
  title: string;
  category: string;
  href: string;
  excerpt: string;
  locationLabel: string;
};

type Props = {
  docs: DirectoryDoc[];
  categories: string[];
  activeSlug?: string;
  keyword?: string;
  onKeywordChange?: (value: string) => void;
};

const normalizeKeyword = (value: string) => value.trim().toLowerCase();

const filterDocs = (docs: DirectoryDoc[], keyword: string) => {
  const query = normalizeKeyword(keyword);
  if (!query) {
    return docs;
  }
  return docs.filter((doc) => doc.searchText.includes(query));
};

const groupDocs = (docs: DirectoryDoc[]) => {
  const map = new Map<string, DirectoryDoc[]>();
  docs.forEach((doc) => {
    if (!map.has(doc.category)) {
      map.set(doc.category, []);
    }
    map.get(doc.category)?.push(doc);
  });
  return map;
};

const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^[#>\-*]+\s*/gm, "")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getExcerpt = (text: string, query: string, radius = 32) => {
  const normalizedText = text.trim();
  if (!normalizedText) {
    return "";
  }

  const lowerText = normalizedText.toLowerCase();
  const index = lowerText.indexOf(query);

  if (index === -1) {
    return normalizedText.length > 90
      ? `${normalizedText.slice(0, 90)}…`
      : normalizedText;
  }

  const start = Math.max(0, index - radius);
  const end = Math.min(normalizedText.length, index + query.length + radius * 2);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < normalizedText.length ? "…" : "";
  return `${prefix}${normalizedText.slice(start, end).trim()}${suffix}`;
};

const findBestHeading = (doc: DirectoryDoc, query: string) => {
  const headingMatched = doc.headings.find((heading) =>
    heading.text.toLowerCase().includes(query)
  );
  if (headingMatched) {
    return headingMatched;
  }

  const queryIndex = doc.content.toLowerCase().indexOf(query);
  if (queryIndex === -1) {
    return null;
  }

  const headingWithIndex = doc.headings
    .map((heading) => {
      const marker = `${"#".repeat(heading.level)} ${heading.text}`.toLowerCase();
      const markerIndex = doc.content.toLowerCase().indexOf(marker);
      const textIndex = doc.content.toLowerCase().indexOf(heading.text.toLowerCase());
      return {
        heading,
        index: markerIndex === -1 ? textIndex : markerIndex,
      };
    })
    .filter((entry) => entry.index !== -1 && entry.index <= queryIndex)
    .sort((a, b) => b.index - a.index)[0];

  return headingWithIndex?.heading ?? null;
};

const buildSearchResults = (docs: DirectoryDoc[], keyword: string): SearchResult[] => {
  const query = normalizeKeyword(keyword);
  if (!query) {
    return [];
  }

  return docs
    .filter((doc) => doc.searchText.includes(query))
    .map((doc) => {
      const heading = findBestHeading(doc, query);
      const plainContent = stripMarkdown(doc.content);
      const excerptSource = plainContent || doc.summary || doc.title;

      return {
        id: `${doc.slug}-${heading?.id ?? "content"}`,
        title: doc.title,
        category: doc.category,
        href: heading ? `/tutorial/${doc.slug}#${heading.id}` : `/tutorial/${doc.slug}`,
        excerpt: getExcerpt(excerptSource, query),
        locationLabel: heading ? `定位到：${heading.text}` : "定位到：正文匹配",
      };
    });
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const renderHighlight = (text: string, keyword: string) => {
  const query = keyword.trim();
  if (!query) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-emerald-100 px-0.5 text-emerald-900"
      >
        {part}
      </mark>
    ) : (
      <Fragment key={`${part}-${index}`}>{part}</Fragment>
    )
  );
};

export default function TutorialDocDirectory({
  docs,
  categories,
  activeSlug,
  keyword,
  onKeywordChange,
}: Props) {
  const [internalKeyword, setInternalKeyword] = useState("");
  const currentKeyword = keyword ?? internalKeyword;
  const query = currentKeyword.trim();
  const isSearching = query.length > 0;

  const handleKeywordChange = (value: string) => {
    if (keyword === undefined) {
      setInternalKeyword(value);
    }
    onKeywordChange?.(value);
  };

  const filteredDocs = useMemo(
    () => filterDocs(docs, currentKeyword),
    [docs, currentKeyword]
  );
  const groupedDocs = useMemo(() => groupDocs(filteredDocs), [filteredDocs]);
  const hasMatches = filteredDocs.length > 0;
  const searchResults = useMemo(
    () => buildSearchResults(docs, currentKeyword),
    [docs, currentKeyword]
  );

  return (
    <aside className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-[var(--shadow-sm)]">
      <div>
        <input
          value={currentKeyword}
          onChange={(event) => handleKeywordChange(event.target.value)}
          placeholder="搜索文档..."
          className="w-full rounded-2xl border border-emerald-100 bg-white/95 px-4 py-3 text-sm text-slate-700 outline-none transition-colors duration-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
      {isSearching ? (
        <div className="mt-4 space-y-3">
          {searchResults.map((result) => (
            <Link
              key={result.id}
              href={result.href}
              className="group block cursor-pointer rounded-2xl border border-emerald-100 bg-white/90 p-4 transition-all duration-200 hover:-translate-y-[1px] hover:border-emerald-300 hover:shadow-[var(--shadow-sm)]"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                  {result.category}
                </span>
                <span className="text-slate-500">{result.locationLabel}</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                {result.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {renderHighlight(result.excerpt, query)}
              </p>
            </Link>
          ))}
          {searchResults.length === 0 ? (
            <p className="text-sm text-slate-500">
              没有检索到相关内容，请尝试更换关键词。
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 space-y-5 text-sm text-slate-600">
          {categories.map((category) => {
            const docsInCategory = groupedDocs.get(category) ?? [];
            if (docsInCategory.length === 0) {
              return null;
            }

            return (
              <div key={category}>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  {category}
                </div>
                <ul className="mt-2 space-y-2">
                  {docsInCategory.map((doc) => (
                    <li key={doc.slug}>
                      <Link
                        href={`/tutorial/${doc.slug}`}
                        className={`cursor-pointer text-sm transition-colors duration-200 hover:text-emerald-700 ${
                          activeSlug === doc.slug
                            ? "font-semibold text-emerald-700"
                            : "text-slate-700"
                        }`}
                      >
                        {doc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {!hasMatches ? (
            <p className="text-xs text-slate-500">未匹配到文档，请调整关键词。</p>
          ) : null}
        </div>
      )}
    </aside>
  );
}
