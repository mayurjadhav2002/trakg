"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { BackendRoute } from "@/stores/constants";
import { useStore } from "@/stores/userStore";
import { useRef } from "react";

export const useAnalytics = () => {
  const { activeWebsite } = useStore();

  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState([]);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(null);

  const getToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw new Error("Not authenticated");
    return data.session.access_token;
  }, []);

  const fetchAnalytics = useCallback(
    async ({ typeOfData = "lead", range = "90d" } = {}) => {
      if (!activeWebsite?.trackingId) return [];

      try {
        setLoading(true);
        setError(null);

        const token = await getToken();

        let url =
          typeOfData === "lead"
            ? `${BackendRoute}/analytics/lead-completion`
            : `${BackendRoute}/analytics/engagement-analytics`;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            websiteId: activeWebsite.trackingId,
            range,
          }),
        });

        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }

        if (!res.ok || !data?.success) {
          const apiError = data?.error || {
            message: data?.message || "Failed to fetch analytics",
          };

          setError(apiError);
          throw apiError;
        }

        setAnalytics(data?.data || []);
        return data?.data || [];
      } catch (err) {
        console.error("Analytics error:", err);

        setError(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [activeWebsite?.trackingId, getToken],
  );

  useEffect(() => {
    if (!activeWebsite?.trackingId) return;

    if (fetchedRef.current === activeWebsite.trackingId) return;

    fetchedRef.current = activeWebsite.trackingId;

    fetchAnalytics({ typeOfData: "lead", range: "90d" });
  }, [activeWebsite?.trackingId]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
  };
};
