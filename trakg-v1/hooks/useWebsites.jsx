"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/stores/userStore";
import { BackendRoute } from "@/stores/constants";
import { supabase } from "@/lib/supabase";

export const useWebsites = () => {
  const websites = useStore((s) => s.websites);
  const setWebsites = useStore((s) => s.setWebsites);
  const removeWebsite = useStore((s) => s.removeWebsite);
  const user = useStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasFetched = useRef(false);
  const getToken = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      throw new Error("Not authenticated");
    }

    return data.session.access_token;
  };

  const fetchWebsites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch(`${BackendRoute}/website/all`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data?.status !== "success") {
        throw new Error(data?.message || "Failed to load websites");
      }

      setWebsites(data?.data?.websites || []);
      hasFetched.current = true;
    } catch (err) {
      console.error("Fetch websites error:", err);
      setError(err.message);
      toast.error(err.message || "Failed to load websites");
    } finally {
      setLoading(false);
    }
  }, [setWebsites]);

  const reFetchWebsites = useCallback(() => {
    hasFetched.current = false;
    fetchWebsites();
  }, [fetchWebsites]);

  const getWebsite = useCallback(async (websiteId, web) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        `${BackendRoute}/website/${websiteId}?url=${web}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok || data?.status !== "Success") {
        throw new Error(data?.message || "Failed to fetch website");
      }

      return data?.data?.website;
    } catch (err) {
      console.error("Get website error:", err);
      toast.error(err.message || "Failed to fetch website");
      throw err;
    }
  }, []);

  const verifyWebsite = useCallback(async (websiteId) => {
    try {
      const token = await getToken();

      const res = await fetch(`${BackendRoute}/website/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          websiteId,
        }),
      });

      const data = await res.json();

      if (!res.ok || data?.status !== "Success") {
        throw new Error(data?.message || "Verification failed");
      }

      toast.success("Website verified successfully");

      return data;
    } catch (err) {
      console.error("Verify website error:", err);
      toast.error(err.message || "Verification failed");
      throw err;
    }
  }, []);

  const addWebsite = useCallback(
    async (formData) => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Not authenticated");

        const payload = {
          website_name: formData.websiteName,
          website_url: formData.website,
          website_description: "",
          website_status: true,
          notification_info: {
            name: formData.notifierName,
            email: formData.notifierEmail,
          },
        };

        const res = await fetch(`${BackendRoute}/website/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok || data?.status !== "Success") {
          throw new Error(data?.message || "Failed to create website");
        }

        toast.success("Website created successfully");

        reFetchWebsites();

        return data;
      } catch (err) {
        console.error("Add website error:", err);
        toast.error(err.message || "Failed to create website");
        throw err;
      }
    },
    [reFetchWebsites],
  );

  const updateWebsite = useCallback(
    async (websiteId, updateFields) => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${BackendRoute}/website/${websiteId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updateFields }),
        });

        const data = await res.json();

        if (!res.ok || data?.status !== "Success") {
          throw new Error(data?.message || "Failed to update website");
        }

        toast.success("Website updated");

        reFetchWebsites();

        return data;
      } catch (err) {
        console.error("Update website error:", err);
        toast.error(err.message || "Failed to update website");
        throw err;
      }
    },
    [reFetchWebsites],
  );

  const deleteWebsite = useCallback(
    async (webId) => {
      try {
        const token = await getToken();

        if (!token) throw new Error("Not authenticated");

        removeWebsite(webId);

        const res = await fetch(`${BackendRoute}/websites/${webId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || data?.status !== "Success") {
          throw new Error(data?.message || "Delete failed");
        }

        toast.success("Website deleted");
      } catch (err) {
        console.error("Delete website error:", err);
        toast.error(err.message || "Failed to delete website");

        reFetchWebsites();
      }
    },
    [removeWebsite, reFetchWebsites],
  );
  const toggleWebsiteField = useCallback(
    async (websiteId, field, currentValue) => {
      try {
        const token = await getToken();

        const res = await fetch(`${BackendRoute}/website/${websiteId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            updateFields: {
              [field]: !currentValue,
            },
          }),
        });

        const data = await res.json();

        if (!res.ok || data?.status !== "Success") {
          throw new Error(data?.message || "Update failed");
        }

        toast.success("Website updated");

        reFetchWebsites();

        return data;
      } catch (err) {
        console.error("Toggle website error:", err);
        toast.error(err.message || "Failed to update website");
        throw err;
      }
    },
    [reFetchWebsites],
  );
  useEffect(() => {
    if (user && !hasFetched.current) {
      fetchWebsites();
    }
  }, [user, websites, fetchWebsites]);

  return {
    websites,
    loading,
    error,
    fetchWebsites,
    reFetchWebsites,
    deleteWebsite,
    addWebsite,
    updateWebsite,
    getWebsite,
    verifyWebsite,
    toggleWebsiteField,
  };
};
