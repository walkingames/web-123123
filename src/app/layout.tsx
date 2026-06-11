import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "WalkinGames — Indie Game Studio",
  description:
    "WalkinGames is an independent game studio crafting immersive gaming experiences. Discover Walkin and Duskfall Requiem.",
  keywords: ["WalkinGames", "indie games", "game studio", "Walkin", "Duskfall Requiem", "gaming"],
  authors: [{ name: "WalkinGames" }],
  creator: "WalkinGames",
  openGraph: {
    title: "WalkinGames — Indie Game Studio",
    description: "Independent game studio crafting immersive gaming experiences.",
    url: "https://walkingames.com",
    siteName: "WalkinGames",
    locale: "en_US",
    type: "website",
    images: [{ url: "/WalkinGames.com.png", width: 1270, height: 1270 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WalkinGames — Indie Game Studio",
    description: "Independent game studio crafting immersive gaming experiences.",
    images: ["/WalkinGames.com.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="WalkinGames" />
        <meta name="theme-color" content="#050505" />
      </head>
      <body className="h-dvh w-dvw overflow-hidden bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
