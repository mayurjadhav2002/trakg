"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";

export default function AppInitializer({ children }) {
  const { initUser } = useUser();

  useEffect(() => {
    initUser();
  }, []);

  return children;
}
