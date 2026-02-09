import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "首右辅助码｜高效中文输入方案",
  description:
    "首右辅助码官网：提供普及版与Plus版，低重码、舒适手感、系统教程与在线查形工具。",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"
  ),
  icons: {
    icon: `${basePath}/logo.jpg`,
    shortcut: `${basePath}/logo.jpg`,
    apple: `${basePath}/logo.jpg`,
  },
  openGraph: {
    title: "首右辅助码｜高效中文输入方案",
    description:
      "低重码、舒适手感、系统教程与在线查形工具，帮助你更高效地中文输入。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text)] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
