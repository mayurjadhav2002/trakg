"use client";

import Loader from "@/components/loading/Loader";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function redirectUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/auth/sign-in");
      }
    }

    redirectUser();
  }, [router]);

  return <Loader />;
}
