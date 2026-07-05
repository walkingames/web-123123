import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import { schabo } from "@/fonts";
import ThemeProvider from "@/components/ThemeProvider";
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

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
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
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WalkinGames — Indie Game Studio",
    description: "Independent game studio crafting immersive gaming experiences.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f0" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${schabo.variable} ${bebasNeue.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="WalkinGames" />
      </head>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-foreground"
        >
          Skip to content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
