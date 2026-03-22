"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useStore } from "@/stores/userStore";
import { BackendRoute } from "@/stores/constants";

const isPublicPath = (pathname) => {
  return (
    ["/auth/sign-in", "/auth/sign-up"].includes(pathname) ||
    pathname.startsWith("/auth/oauth") ||
    pathname.startsWith("/auth/verify") ||
    pathname.startsWith("/checkout/")
  );
};

export const useUser = () => {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const logoutStore = useStore((s) => s.logout);
  const setLoading = useStore((s) => s.setLoading);

  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = isPublicPath(pathname);

  const Logout = useCallback(async () => {
    await supabase.auth.signOut();
    logoutStore();
    router.replace("/auth/sign-in");
  }, [logoutStore, router]);

  const initUser = useCallback(async () => {
    if (user) return;

    try {
      setLoading("user", true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        if (!isPublicPage) router.replace("/auth/sign-in");
        return;
      }

      const token = session.access_token;

      await fetch(`${BackendRoute}/auth/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await fetch(`${BackendRoute}/account/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();

      setUser(data.user);
    } catch (err) {
      console.error("User init failed:", err);

      if (!isPublicPage) {
        toast.error("Session expired. Please login again.");
        Logout();
      }
    } finally {
      setLoading("user", false);
    }
  }, []);
  return {
    user,
    initUser,
    Logout,
  };
};
