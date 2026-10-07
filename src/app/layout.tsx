import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { schabo } from "@/fonts";
import { brand, ogImageAlt, siteDescription, siteName, siteTagline, siteTitle, siteUrl } from "@/lib/site";
import "./editorial.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: siteTitle,
  description: siteDescription,
  keywords: ["WalkinGames", "indie games", "game studio", "Walkin", "Duskfall Requiem", "gaming"],
  authors: [{ name: siteName }],
  creator: siteName,
  category: "games",
  openGraph: {
    title: siteTitle,
    description: siteTagline,
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteTagline,
    images: [{ url: "/opengraph-image", alt: ogImageAlt }],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: brand.background,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${schabo.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-title" content="WalkinGames" />
      </head>
      <body suppressHydrationWarning>
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}