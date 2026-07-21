import { useState, useEffect } from "react";
import { getBusinessSettings } from "@/db/settingsApi";
import type { BusinessSettings } from "@/types/types";

export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBusinessSettings();
      setSettings(data);
    } catch (err) {
      console.error("Error loading business settings:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadSettings();
  };

  return {
    settings,
    loading,
    error,
    refresh,
  };
}

