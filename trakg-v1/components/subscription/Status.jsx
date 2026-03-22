"use client";

import React, { useState } from "react";
import Link from "next/link";
function formatDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}
function SkeletonLoader() {
  return (
    <div
      className={`relative w-full start-0 z-50 flex flex-col justify-between p-4 border mb-6 rounded-lg bg-gray-100 border-gray-200 dark:bg-[#18181b] dark:border-gray-700 animate-pulse`}
    >
      <div className="mb-4 md:mb-0 md:me-4">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-2 dark:bg-gray-600"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2 dark:bg-gray-700"></div>

        <div className="h-2 bg-gray-200 rounded w-1/4 mt-4 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

export default function SubscriptionStatus() {
  return <></>;
}
