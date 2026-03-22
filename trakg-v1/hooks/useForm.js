"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useStore } from "@/stores/userStore";
import { supabase } from "@/lib/supabase";
import { BackendRoute } from "@/stores/constants";

export const useForms = () => {
  const {
    activeWebsite,
    forms,
    setForms,
    updateForm,
    setFormAnalytics,
    formAnalytics,
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [page, setPage] = useState(0);

  const take = 10;

  const getToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) throw new Error("Not authenticated");

    return data.session.access_token;
  }, []);

  const fetchForms = useCallback(async () => {
    if (!activeWebsite?.trackingId) return;

    try {
      setLoading(true);

      const token = await getToken();

      const params = new URLSearchParams({
        websiteId: activeWebsite.trackingId,
        pageNumber: page.toString(),
        limit: take.toString(),
      });

      const res = await fetch(`${BackendRoute}/form?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data?.status !== "Success") {
        throw new Error(data?.message || "Failed to fetch forms");
      }

      setForms(data?.data || []);
    } catch (err) {
      console.error("Fetch forms error:", err);
      toast.error(err.message || "Failed to load forms");
    } finally {
      setLoading(false);
    }
  }, [activeWebsite?.trackingId, page, take, setForms, getToken]);

  const toggleFormStatus = useCallback(
    async ({ formId, isSelected }) => {
      try {
        const token = await getToken();

        updateForm(formId, { isActive: isSelected });

        const res = await fetch(`${BackendRoute}/form/${formId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            updateFields: { isActive: isSelected },
          }),
        });

        const data = await res.json();

        if (!res.ok || data?.status !== "Success") {
          throw new Error(data?.message || "Failed to update form");
        }

        toast.success(`Form ${isSelected ? "activated" : "deactivated"}`);
      } catch (err) {
        console.error("Toggle form error:", err);
        toast.error(err.message || "Failed to update form");

        fetchForms();
      }
    },
    [updateForm, fetchForms, getToken],
  );

  const fetchFormAnalytics = useCallback(
    async (formId) => {
      if (!formId) return;

      if (formAnalytics?.[formId]) {
        return formAnalytics[formId];
      }

      try {
        const token = await getToken();

        const res = await fetch(
          `${BackendRoute}/form/analytics?form_id=${formId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (!res.ok || data?.status !== "Success") {
          throw new Error(data?.message || "Failed to load analytics");
        }

        setFormAnalytics(formId, data.data);

        return data.data;
      } catch (err) {
        console.error("Analytics fetch error:", err);
        toast.error(err.message || "Failed to load analytics");
        throw err;
      }
    },
    [formAnalytics, setFormAnalytics, getToken],
  );

  const getFormAnalytics = async (formId) => {
    setAnalyticsLoading(true);
    try {
      return await fetchFormAnalytics(formId);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(p - 1, 0));

  useEffect(() => {
    if (activeWebsite) fetchForms();
  }, [activeWebsite, page, fetchForms]);

  return {
    forms,
    loading,

    page,
    nextPage,
    prevPage,

    fetchForms,
    toggleFormStatus,

    fetchFormAnalytics,
    getFormAnalytics,
    analyticsLoading,
  };
};
