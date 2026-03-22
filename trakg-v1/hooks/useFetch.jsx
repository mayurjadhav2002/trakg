"use client";

import useSWR from "swr";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

export const fetcher = async (url, options = {}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: session?.access_token
        ? `Bearer ${session.access_token}`
        : "",
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.message || "Request failed");
  }

  return json;
};

export const useFetch = (key, { fetchOptions = {}, swrOptions = {} } = {}) => {
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState(null);

  const { data, error, isLoading, mutate } = useSWR(
    key || null,
    (url) => fetcher(url, fetchOptions),
    {
      revalidateOnFocus: false,
      ...swrOptions,
      onError: (err) => {
        toast.error(err.message || "Fetch failed");
        swrOptions?.onError?.(err);
      },
    },
  );

  /**
   * Manual fetch for POST / PUT / DELETE
   */
  const fetchData = async (url, options = {}) => {
    setManualLoading(true);
    setManualError(null);

    try {
      const res = await fetcher(url, options);

      if (res?.status === "Success") {
        toast.success(res.message || "Operation successful");

        // refresh SWR cache
        mutate();

        return res;
      }

      throw new Error(res.message || "Request failed");
    } catch (err) {
      console.error("fetchData error:", err);
      setManualError(err.message);
      toast.error(err.message || "Request failed");
      throw err;
    } finally {
      setManualLoading(false);
    }
  };

  return {
    data,
    error: error || manualError,
    loading: isLoading || manualLoading,
    mutate,
    fetchData,
  };
};
