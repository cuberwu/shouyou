"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  {
    title: "产品",
    items: [
      { label: "方案介绍", href: "/about" },
      { label: "版本对比", href: "/#versions" },
      { label: "下载中心", href: "/download" },
    ],
  },
  {
    title: "教程",
    items: [
      { label: "入门教程", href: "/tutorial" },
      { label: "查形工具", href: "/lookup" },
      { label: "练习中心", href: "/practice" },
    ],
  },
  {
    title: "社区",
    items: [
      { label: "GitHub", href: "https://github.com/shouyou" },
      { label: "QQ 群", href: "https://qm.qq.com/q/1jfFcpqhX0" },
      { label: "邮箱", href: "mailto:hello@example.com" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (pathname.startsWith("/tutorial")) {
    return null;
  }

  return (
    <footer className="border-t border-white/40 bg-white/70">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[2fr_3fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src={`${basePath}/logo.jpg`}
                alt="首右辅助码 Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <div className="text-base font-semibold">首右辅助码</div>
                <div className="text-sm text-slate-600">高效中文输入方案</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              普及版与 Plus 版双路线设计，提供系统教程、查形工具与多平台配置，帮助你更快、更准确地输入中文。
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <div className="text-sm font-semibold text-slate-800">
                  {group.title}
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      {item.href.startsWith("/") ? (
                        <Link
                          href={item.href}
                          className="cursor-pointer transition-colors duration-200 hover:text-[var(--color-primary)]"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className="cursor-pointer transition-colors duration-200 hover:text-[var(--color-primary)]"
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-dashed border-slate-200 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>© 2026 首右辅助码 · All rights reserved.</span>
          <span>备案号：待申请</span>
        </div>
      </div>
    </footer>
  );
}
