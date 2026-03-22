"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BackendRoute } from "@/stores/constants";
import { useStore } from "@/stores/userStore";
import { toast } from "sonner";
import { useRef } from "react";

export const useLeads = () => {
  const { activeWebsite } = useStore();

  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [take, setTake] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedFormId, setSelectedFormId] = useState("");
  const [conversionStatus, setConversionStatus] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const initialFetch = useRef(false);

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) throw new Error("Not authenticated");

    return data.session.access_token;
  };

  const fetchFilters = useCallback(async () => {
    if (!activeWebsite?.trackingId) return;

    try {
      const token = await getToken();

      const res = await fetch(
        `${BackendRoute}/lead/allFilters?website_id=${activeWebsite.trackingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message);

      setFilters(data?.data);
    } catch (err) {
      console.error("Filter fetch error:", err);
    }
  }, [activeWebsite?.trackingId]);

  const fetchLeads = useCallback(async () => {
    if (!activeWebsite?.trackingId) return;

    try {
      setLoading(true);
      setError(null);

      const token = await getToken();

      const params = new URLSearchParams({
        website_id: activeWebsite.trackingId,
        page: page,
        limit: take,
      });

      if (selectedCountry) params.set("country", selectedCountry);
      if (conversionStatus) params.set("conversion", conversionStatus);
      if (searchValue) params.set("search", searchValue);
      if (selectedFormId && selectedFormId !== "all")
        params.set("form_id", selectedFormId);

      const res = await fetch(`${BackendRoute}/lead?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data?.status !== "Success") {
        throw new Error(data?.message);
      }

      setLeads(data?.data?.leads || []);
      setTotalPages(data?.data?.totalPages || 1);
    } catch (err) {
      console.error("Lead fetch error:", err);
      setError(err);
      toast.error(err?.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [
    activeWebsite?.trackingId,
    page,
    take,
    selectedCountry,
    selectedFormId,
    conversionStatus,
    searchValue,
  ]);

  const deleteLead = useCallback(
    async (leadId) => {
      try {
        const token = await getToken();

        const res = await fetch(`${BackendRoute}/lead/delete/${leadId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || data?.status !== "Success") {
          throw new Error(data?.message);
        }

        toast.success("Lead deleted successfully");
        fetchLeads();
      } catch (err) {
        console.error("Delete lead error:", err);
        toast.error(err?.message || "Failed to delete lead");
      }
    },
    [fetchLeads],
  );

  const getLead = useCallback(async (leadId) => {
    if (!leadId) return null;

    try {
      const token = await getToken();

      const res = await fetch(`${BackendRoute}/lead/getOne`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadId }),
      });

      const data = await res.json();

      if (!res.ok || data?.status !== "Success") {
        throw new Error(data?.message);
      }

      return data?.data;
    } catch (err) {
      console.error("Lead fetch error:", err);
      toast.error(err?.message || "Failed to load lead");
      return null;
    }
  }, []);

  useEffect(() => {
    if (!activeWebsite?.trackingId) return;

    if (!initialFetch.current) {
      fetchFilters();
      initialFetch.current = true;
    }
    fetchLeads();
  }, [
    activeWebsite?.trackingId,
    page,
    take,
    selectedCountry,
    selectedFormId,
    conversionStatus,
    searchValue,
  ]);

  return {
    leads,
    filters,
    loading,
    error,

    page,
    setPage,
    take,
    setTake,
    totalPages,

    selectedCountry,
    setSelectedCountry,
    selectedFormId,
    setSelectedFormId,
    conversionStatus,
    setConversionStatus,
    searchValue,
    setSearchValue,

    fetchLeads,
    deleteLead,
    getLead,
  };
};
