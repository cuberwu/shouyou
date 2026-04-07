import Link from "next/link";

import RootChart from "@/components/RootChart";
import type { HomeHeroContent } from "@/data/homeContent";

type HomeHeroProps = {
  content: HomeHeroContent;
};

export default function HomeHero({ content }: HomeHeroProps) {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
          {content.eyebrow}
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            {content.title}
            <span className="block text-[var(--color-primary)]">{content.subtitle}</span>
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            {content.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href={content.primaryAction.href}
            className="cursor-pointer rounded-full bg-[var(--color-cta)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:translate-y-[-1px] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta)]"
          >
            {content.primaryAction.label}
          </Link>
          <Link
            href={content.secondaryAction.href}
            className="cursor-pointer rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:border-emerald-400 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            {content.secondaryAction.label}
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {content.meta.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/70 bg-white/65 px-3 py-1.5 shadow-[var(--shadow-sm)]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-center lg:h-full lg:justify-end">
        <RootChart />
      </div>
    </section>
  );
}
