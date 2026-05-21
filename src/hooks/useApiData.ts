import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { readLocal, writeLocal } from "@/utils/storage";
import type { ApiResource } from "@/types";

export function useApiData<T>(url: string, fallback: T, localKey?: string): ApiResource<T> {
  const normalizeData = (value: unknown): T => {
    if (Array.isArray(fallback)) {
      return (Array.isArray(value) ? value : fallback) as T;
    }

    if (fallback !== null && typeof fallback === "object") {
      return (value && typeof value === "object" && !Array.isArray(value) ? value : fallback) as T;
    }

    return (value ?? fallback) as T;
  };

  const [data, setData] = useState<T>(() =>
    normalizeData(localKey ? readLocal(localKey, fallback) : fallback)
  );
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      console.debug("[useApiData] load", { url });
      setLoading(true);
      const response = await api.get<T>(url);
      const nextData = normalizeData(response.data);
      console.debug("[useApiData] loaded", { url, data: nextData });
      setData(nextData);
      if (localKey) writeLocal(localKey, nextData);
    } catch (error) {
      console.debug("[useApiData] load failed", { url, error });
      setData(normalizeData(localKey ? readLocal(localKey, fallback) : fallback));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [url]);

  return { data, setData, loading, reload: load };
}
