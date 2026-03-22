"use client";

import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/userStore";
import SuspenseLoader from "@/components/loading/SuspenseLoader";
import OAuthRedirectClient, {
  VerifyingLoader,
} from "@/components/auth/OauthVerification";
import { BackendRoute } from "@/stores/constants";

export default function OAuthRedirectPage() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);

  const [errorMessage, setErrorMessage] = useState(null);
  const [redirectPath] = useState("/dashboard");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("No session found");
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
          throw new Error("Failed to fetch user profile");
        }

        const result = await res.json();

        setUser(result.user);

        router.replace("/dashboard?d=welcome");
      } catch (err) {
        console.error("OAuth verification failed:", err);
        setErrorMessage("Authentication failed. Please login again.");
      }
    };

    verifyUser();
  }, [router, setUser]);

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <VerifyingLoader />
    </Suspense>
  );
}
