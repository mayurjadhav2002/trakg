import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProviders } from "@/components/providers/ThemeProvider";

import "./globals.css";
import { Oxygen } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/context/PostHog";
import Trakg from "@trakg/react";
import AppInitializer from "@/context/AppInitializer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const oxygenFont = Oxygen({
  variable: "--font-oxygen",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Trakg | Lead Recovery & Form Analytics for Higher Conversions",
  description:
    "Trakg helps you recover lost leads by tracking form abandonment, analyzing user behavior, and optimizing conversions. Boost sales with smart form analytics and drop-off insights.",
  icons: {
    icon: [
      {
        url: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  appleWebApp: {
    title: "Trakg",
    statusBarStyle: "black-translucent",
  },

  openGraph: {
    title: "Trakg | Lead Recovery & Form Analytics for Higher Conversions",
    description:
      "Effortlessly view form data even if the user doesn’t submit. Track interactions, engagement, and analytics to drive smarter decisions.",
    url: "https://app.trakg.com",
    siteName: "Trakg",
    type: "website",
    images: [
      {
        url: "https://trakg.com/img/socials/og.jpg",
        width: 1200,
        height: 630,
        alt: "Trakg - Smart Lead tracking and recovery tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trakg | Lead Recovery & Form Analytics for Higher Conversions",
    description:
      "Effortlessly view form data even if the user doesn’t submit. Track interactions, engagement, and analytics to drive smarter decisions.",
    images: ["https://trakg.com/img/socials/og.jpg"],
    creator: "@trakg_com",
  },
  robots: "noindex, nofollow",
  // themeColor: "#4b6feb",

  other: {
    canonical: "https://trakg.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oxygenFont.variable} antialiased`}
        style={{ fontFamily: "var(--font-oxygen)" }}
      >
        <AppInitializer>
          <PostHogProvider>
            <ThemeProviders>
              {children}
              <Toaster />
            </ThemeProviders>
          </PostHogProvider>
        </AppInitializer>
        <Trakg id="31d9458c1e" environment="development" />
      </body>
    </html>
  );
}
