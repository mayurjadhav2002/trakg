"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { BackendRoute } from "@/stores/constants";
import { toast } from "sonner";

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(false);

  const getToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      throw new Error("Not authenticated");
    }

    return data.session.access_token;
  }, []);

  const getNotificationPreferences = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const res = await fetch(`${BackendRoute}/account/notification`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch preferences");
      }

      const formatted = Object.entries(data.data).reduce((acc, [k, v]) => {
        acc[k] = v ? "enabled" : "disabled";
        return acc;
      }, {});

      setPreferences(formatted);

      return formatted;
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notification preferences");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const updateNotificationPreference = useCallback(
    async (type, subscribe) => {
      try {
        const token = await getToken();

        const res = await fetch(`${BackendRoute}/account/notification/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type, subscribe }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Update failed");
        }

        setPreferences((prev) => ({
          ...prev,
          [type]: subscribe ? "enabled" : "disabled",
        }));

        toast.success(
          `${type} notifications ${subscribe ? "enabled" : "disabled"}`,
        );

        return data;
      } catch (err) {
        console.error(err);
        toast.error("Failed to update notification preference");
      }
    },
    [getToken],
  );

  return {
    preferences,
    loading,
    getNotificationPreferences,
    updateNotificationPreference,
  };
};
