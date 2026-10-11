import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { Providers } from "@/components/ui/Providers";
import { profile } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

const description = `${profile.title}. ${profile.description}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: profile.siteName,
    template: `%s — ${profile.name}`,
  },
  description,
  applicationName: profile.siteName,
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  keywords: [
    "Aniket Barai",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "Software Engineering Internship",
    "Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.siteName,
    title: profile.siteName,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: profile.siteName,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning={false}>
      <head>
        {/* Scroll reveals start invisible; if JavaScript never runs, show them plainly. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
