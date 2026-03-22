"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { BackendRoute } from "@/stores/constants";
import { toast } from "sonner";

export const useDeleteAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw new Error("Not authenticated");
    return data.session.access_token;
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();

      const res = await fetch(`${BackendRoute}/account/user/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Account deletion failed");
      }

      toast.success("Account deleted successfully", { richColors: true });

      return data;
    } catch (err) {
      console.error(err);
      setError(err);
      toast.error("Failed to delete account", { richColors: true });
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  return {
    deleteAccount,
    loading,
    error,
  };
};