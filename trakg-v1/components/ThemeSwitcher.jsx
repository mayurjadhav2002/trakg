"use client";

import { Switch } from "@/components/ui/switch";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <SunIcon className="w-4 h-4 text-muted-foreground" />

      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />

      <MoonIcon className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}
