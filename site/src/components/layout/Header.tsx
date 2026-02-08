"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "教程", href: "/tutorial" },
  { label: "练习", href: "/practice" },
  { label: "查形", href: "/lookup" },
  { label: "关于", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const isMobileMenuOpen = mobileMenuPath === pathname;
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const closeMobileMenu = () => {
    setMobileMenuPath(null);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!mobileMenuRef.current) {
        return;
      }

      if (mobileMenuRef.current.contains(event.target as Node)) {
        return;
      }

      closeMobileMenu();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isMobileMenuOpen]);

  const displayLinks =
    pathname === "/"
      ? navLinks
      : [{ label: "回到首页", href: "/" }, ...navLinks];

  const toggleMobileMenu = () => {
    setMobileMenuPath((prev) => (prev === pathname ? null : pathname));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/50 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_1px_3px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          aria-label="首右辅助码首页"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white">
            首右
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold text-[var(--color-text)]">
              首右辅助码
            </div>
            <div className="text-xs text-slate-600">普及版 · Plus版</div>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-medium text-slate-700 lg:flex"
          aria-label="主导航"
        >
          {displayLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer transition-colors duration-200 hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/download"
            className="cursor-pointer rounded-full bg-[var(--color-cta)] px-4 py-2 text-white transition-all duration-200 hover:translate-y-[-1px] hover:opacity-90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta)]"
          >
            立即下载
          </Link>
        </nav>

        <div ref={mobileMenuRef} className="relative flex items-center gap-3 lg:hidden">
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "收起导航菜单" : "展开导航菜单"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            className={`relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border bg-white/80 text-slate-700 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
              isMobileMenuOpen
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-slate-200/90 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            }`}
            onClick={toggleMobileMenu}
          >
            <span
              aria-hidden="true"
              className={`absolute left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                isMobileMenuOpen
                  ? "top-1/2 w-3.5 -translate-y-1/2"
                  : "top-[14px]"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                isMobileMenuOpen
                  ? "top-1/2 -translate-y-1/2 scale-x-0 opacity-0"
                  : "top-[21px] scale-x-100 opacity-100"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                isMobileMenuOpen
                  ? "top-1/2 w-3.5 -translate-y-1/2"
                  : "top-[28px]"
              }`}
            />
          </button>

          <Link
            href="/download"
            className="cursor-pointer rounded-full bg-[var(--color-cta)] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta)]"
            onClick={closeMobileMenu}
          >
            立即下载
          </Link>

          <div
            id="mobile-nav-menu"
            aria-hidden={!isMobileMenuOpen}
            className={`absolute right-0 top-[calc(100%+10px)] z-50 flex w-[calc(100vw-2rem)] flex-col items-center gap-6 overflow-hidden rounded-3xl border border-white/70 bg-[rgba(252,250,248,0.95)] text-slate-700 shadow-[0_10px_40px_-10px_rgba(122,71,50,0.18)] backdrop-blur-[24px] transition-[max-height,opacity,transform,padding,visibility] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] origin-top-right ${
              isMobileMenuOpen
                ? "visible max-h-[320px] px-6 py-8 opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "invisible max-h-0 px-6 py-0 opacity-0 -translate-y-2 scale-[0.98] pointer-events-none"
            }`}
          >
            {displayLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`cursor-pointer text-lg font-semibold tracking-[0.01em] transition-[color,opacity,transform] duration-300 hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                  isMobileMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                }`}
                onClick={closeMobileMenu}
                tabIndex={isMobileMenuOpen ? 0 : -1}
                style={{
                  transitionDelay: isMobileMenuOpen
                    ? `${100 + index * 50}ms`
                    : "0ms",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
