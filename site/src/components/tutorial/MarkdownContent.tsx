import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { slugify } from "@/lib/slugify";

const HeadingRenderer = ({
  level,
  text,
}: {
  level: number;
  text: string;
  children: React.ReactNode;
}) => {
  const id = slugify(text);
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag
      id={id}
      className="mt-8 scroll-mt-24 text-lg font-semibold text-slate-900"
    >
      {text}
    </Tag>
  );
};

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 text-2xl font-semibold text-slate-900">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <HeadingRenderer level={2} text={String(children)}>
              {children}
            </HeadingRenderer>
          ),
          h3: ({ children }) => (
            <HeadingRenderer level={3} text={String(children)}>
              {children}
            </HeadingRenderer>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-slate-600">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="ml-4 list-disc space-y-2 text-sm text-slate-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-4 list-decimal space-y-2 text-sm text-slate-600">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-emerald-700 underline-offset-4 hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
