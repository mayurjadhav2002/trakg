"use client";

import { useStore } from "@/stores/userStore";
import { useFetch } from "@/hooks/useFetch";
import { BackendRoute } from "@/stores/constants";

export const useDashboardStats = () => {
  const activeWebsite = useStore((s) => s.activeWebsite);

  return useFetch(
    activeWebsite?.trackingId
      ? `${BackendRoute}/stats/usage-details?websiteId=${activeWebsite.trackingId}`
      : null,
  );
};
