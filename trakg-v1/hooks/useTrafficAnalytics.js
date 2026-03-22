"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { BackendRoute } from "@/stores/constants";
import { useStore } from "@/stores/userStore";
import { useRef } from "react";

export const useTrafficAnalytics = () => {
  const { activeWebsite } = useStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState(null);
  const fetchedRef = useRef(null);

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) throw new Error("Not authenticated");

    return data.session.access_token;
  };

  const fetchTrafficAnalytics = useCallback(async () => {
    if (!activeWebsite?.trackingId) return;

    try {
      setLoading(true);
      setError(null);

      const token = await getToken();

      const res = await fetch(`${BackendRoute}/analytics/engagement-analytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          website_id: activeWebsite.trackingId,
        }),
      });

      let json;
      try {
        json = await res.json();
      } catch {
        json = {};
      }

      if (!res.ok || json?.status !== "Success") {
        const apiError = json?.error || {
          message: json?.message || "Failed to fetch analytics",
        };

        setError(apiError);
        throw apiError;
      }

      setData(json.data);
    } catch (err) {
      console.error("Traffic analytics error:", err);
      setError(err);
      toast.error(err?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [activeWebsite?.trackingId]);

  useEffect(() => {
    if (!activeWebsite?.trackingId) return;

    if (fetchedRef.current === activeWebsite.trackingId) return;

    fetchedRef.current = activeWebsite.trackingId;

    fetchTrafficAnalytics();
  }, [activeWebsite?.trackingId]);

  const visitorCountryCounts = data?.visitorCountryCounts || [];
  const deviceTypeCounts = data?.deviceTypeCounts || [];
  const referralCounts = data?.referralCounts || [];
  const pageVisitedCounts = data?.pageVisitedCounts || [];

  const formattedCountryData = useMemo(
    () => [
      ["Country", "Visitors"],
      ...visitorCountryCounts.map((item) => [
        item.country || "Unknown",
        item._count?.country || 0,
      ]),
    ],
    [visitorCountryCounts],
  );

  const formattedReferralData = useMemo(
    () =>
      referralCounts.map((item) => [
        item.referral || "Unknown",
        item._count || 0,
      ]),
    [referralCounts],
  );

  const formattedPageUrlData = useMemo(
    () =>
      pageVisitedCounts.map((item) => ({
        name: item.pageUrl || "Unknown",
        value: item._count?.pageUrl || 0,
      })),
    [pageVisitedCounts],
  );

  return {
    loading,
    error,

    deviceTypeCounts,
    formattedCountryData,
    formattedReferralData,
    formattedPageUrlData,

    fetchTrafficAnalytics,
  };
};
