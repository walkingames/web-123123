import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { schabo } from "@/fonts";
import "./globals.css";

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
  metadataBase: new URL("https://walkingames.com"),
  title: "WalkinGames — Independent Game Studio",
  description:
    "WalkinGames is an independent game studio creating focused, replayable experiences for mobile and PC. Discover Walkin and Duskfall Requiem.",
  keywords: ["WalkinGames", "indie games", "game studio", "Walkin", "Duskfall Requiem", "gaming"],
  authors: [{ name: "WalkinGames" }],
  creator: "WalkinGames",
  openGraph: {
    title: "WalkinGames — Independent Game Studio",
    description: "Focused, replayable games with atmosphere and a pulse.",
    url: "https://walkingames.com",
    siteName: "WalkinGames",
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WalkinGames — Independent Game Studio",
    description: "Focused, replayable games with atmosphere and a pulse.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
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