import fs from "fs";
import path from "path";

import matter from "gray-matter";

import { slugify } from "@/lib/slugify";

export type DocFrontmatter = {
  title: string;
  summary: string;
  category: string;
  updatedAt: string;
};

export type DocRecord = DocFrontmatter & {
  slug: string;
  content: string;
  headings: { id: string; text: string; level: number }[];
  searchText: string;
};

export type DocSummary = DocFrontmatter & {
  slug: string;
  searchText: string;
  content: string;
  headings: { id: string; text: string; level: number }[];
};

export const categoryOrder = ["导读", "双拼", "双形", "应用", "排错"];

const docsDirectory = path.join(process.cwd(), "content", "docs");
const docsOverviewPath = path.join(process.cwd(), "content", "docs-overview.md");

const normalizeText = (value: string) =>
  value
    .replace(/[`*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const normalizeUpdatedAt = (value: unknown) => {
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  if (typeof value === "string") {
    return value;
  }
  if (value === undefined || value === null) {
    return "";
  }
  return String(value);
};

const extractHeadings = (content: string) => {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    headings.push({ id: slugify(text), text, level });
  }

  return headings;
};

const buildSearchText = (frontmatter: DocFrontmatter, content: string) => {
  const combined = `${frontmatter.title} ${frontmatter.summary} ${frontmatter.category} ${content}`;
  return normalizeText(combined);
};

const getCategoryIndex = (category: string) => {
  const index = categoryOrder.indexOf(category);
  return index === -1 ? categoryOrder.length : index;
};

const sortDocs = (a: DocRecord, b: DocRecord) => {
  const categorySort = getCategoryIndex(a.category) - getCategoryIndex(b.category);
  if (categorySort !== 0) {
    return categorySort;
  }
  return a.title.localeCompare(b.title, "zh-Hans-CN");
};

export const getAllDocs = (): DocRecord[] => {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }

  const files = fs
    .readdirSync(docsDirectory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));


  return files
    .map((file) => {
      const slug = file.replace(/\.(md|mdx)$/, "");
      const filePath = path.join(docsDirectory, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const frontmatter = data as DocFrontmatter;

      return {
        ...frontmatter,
        updatedAt: normalizeUpdatedAt(
          (frontmatter as { updatedAt?: unknown }).updatedAt
        ),
        slug,
        content,
        headings: extractHeadings(content),
        searchText: buildSearchText(frontmatter, content),
      };
    })
    .sort(sortDocs);
};

export const getAllDocSummaries = (): DocSummary[] =>
  getAllDocs().map((doc) => ({
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    category: doc.category,
    updatedAt: doc.updatedAt,
    searchText: doc.searchText,
    content: doc.content,
    headings: doc.headings,
  }));

export const getDocBySlug = (slug: string): DocRecord | null => {
  const filePathMd = path.join(docsDirectory, `${slug}.md`);
  const filePathMdx = path.join(docsDirectory, `${slug}.mdx`);
  const filePath = fs.existsSync(filePathMd) ? filePathMd : filePathMdx;

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as DocFrontmatter;

  return {
    ...frontmatter,
    updatedAt: normalizeUpdatedAt(
      (frontmatter as { updatedAt?: unknown }).updatedAt
    ),
    slug,
    content,
    headings: extractHeadings(content),
    searchText: buildSearchText(frontmatter, content),
  };
};

export const getDocSlugs = (): string[] =>
  getAllDocs().map((doc) => doc.slug);

export const getTutorialOverviewContent = (): string => {
  if (!fs.existsSync(docsOverviewPath)) {
    return "# 文档总览\n\n请在 content/docs-overview.md 中补充首页总览内容。";
  }
  return fs.readFileSync(docsOverviewPath, "utf8");
};
