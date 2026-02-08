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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

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
  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/80 backdrop-blur">
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
            className="cursor-pointer rounded-full bg-[var(--color-cta)] px-4 py-2 text-white transition-all duration-200 hover:translate-y-[-1px] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta)]"
          >
            立即下载
          </Link>
        </nav>

        <div ref={mobileMenuRef} className="relative lg:hidden">
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            className="cursor-pointer rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            onClick={() => {
              setIsMobileMenuOpen((prev) => !prev);
            }}
          >
            菜单
          </button>
          {isMobileMenuOpen ? (
            <div
              id="mobile-nav-menu"
              className="absolute right-0 mt-3 flex w-56 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-[var(--shadow-md)]"
            >
              {displayLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="cursor-pointer transition-colors duration-200 hover:text-[var(--color-primary)]"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/download"
                className="cursor-pointer rounded-full bg-[var(--color-cta)] px-4 py-2 text-center text-white transition-all duration-200 hover:opacity-90"
                onClick={closeMobileMenu}
              >
                立即下载
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
