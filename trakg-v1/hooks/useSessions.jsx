"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { BackendRoute } from "@/stores/constants";

export const useSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw new Error("Not authenticated");
    return data.session.access_token;
  }, []);

  const fetchSessions = useCallback(
    async (limit = 10) => {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();

        let url = `${BackendRoute}/session/all-sessions`;

        if (limit >= 1) {
          url += `?limit=${limit}`;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch sessions");
        }

        setSessions(data?.data || data);

        return data;
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [getToken],
  );

  return {
    sessions,
    loading,
    error,
    fetchSessions,
  };
};