"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/useSettings";

export default function ThemeProvider({ children }) {
  const { settings, isLoading } = useSettings();

  useEffect(() => {
    if (!isLoading && settings.theme) {
      document.documentElement.setAttribute("data-theme", settings.theme);
    }
  }, [settings.theme, isLoading]);

  return <>{children}</>;
}