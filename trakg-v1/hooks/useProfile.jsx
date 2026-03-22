"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { BackendRoute } from "@/stores/constants";
import { useStore } from "@/stores/userStore";

export const useProfile = () => {
  const { user, setUserDetails } = useStore();

  const [profile, setProfile] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const changedData = useRef({});

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const getToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) throw new Error("Not authenticated");

    return data.session.access_token;
  }, []);

  const updateField = (name, value) => {
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    changedData.current[name] = value;
  };

  const uploadAvatar = useCallback(
    async (file) => {
      if (!file) return;

      try {
        setUploading(true);

        const token = await getToken();

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(`${BackendRoute}/account/avatar/new`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Upload failed");
        }

        const avatarUrl = data?.data?.avatar;

        setProfile((prev) => ({
          ...prev,
          avatar: avatarUrl,
        }));

        changedData.current.avatar = avatarUrl;

        toast.success("Avatar uploaded successfully", { richColors: true });

        return avatarUrl;
      } catch (err) {
        console.error(err);
        setError(err);
        toast.error("Failed to upload avatar", { richColors: true });
      } finally {
        setUploading(false);
      }
    },
    [getToken],
  );

  const updateProfile = useCallback(async () => {
    if (Object.keys(changedData.current).length === 0) {
      toast.info("No changes to update", { richColors: true });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await getToken();

      const res = await fetch(`${BackendRoute}/account/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: changedData.current,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Profile update failed");
      }

      setUserDetails(data.data);
      changedData.current = {};

      toast.success("Profile updated successfully", { richColors: true });

      return data.data;
    } catch (err) {
      setError(err);
      toast.error("Failed to update profile", { richColors: true });
    } finally {
      setLoading(false);
    }
  }, [getToken, setUserDetails]);
  const handleUpdate = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    changedData.current[name] = value;
  };
  return {
    profile,
    loading,
    uploading,
    error,
    updateField,
    uploadAvatar,
    updateProfile,
    handleUpdate,
  };
};
