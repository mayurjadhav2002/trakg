import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 focus:dark:ring-blue-700/30",
  // border color
  "focus:border-blue-500 focus:dark:border-blue-700",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
];

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return `${h > 0 ? h + "h " : ""}${m > 0 ? m + "m " : ""}${s}s`.trim();
}

export function getBaseUrl() {
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  // Check if protocol is already included
  if (!/^https?:\/\//i.test(baseUrl)) {
    const protocol =
      process.env.NEXT_PUBLIC_APP_ENVIRONMENT === "development"
        ? "http"
        : "https";
    baseUrl = `${protocol}://${baseUrl}`;
  }

  return baseUrl;
}

export function safeValue(value, fallback = "Unknown") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return value;
}
