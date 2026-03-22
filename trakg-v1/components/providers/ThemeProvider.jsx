"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProviders({ children }) {
  return (
    <>
      <NextThemesProvider attribute="class" defaultTheme="light">
        {children}
      </NextThemesProvider>
    </>
  );
}
