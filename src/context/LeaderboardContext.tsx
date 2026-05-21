import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/services/api";

export type LeaderboardEntry = {
  id: string;
  name?: string;
  amount: number;
  message: string;
  anonymous?: boolean;
  createdAt?: string;
  isLeaderboardEntry?: boolean;
};

const STORAGE_KEY = "cc_admin_leaderboard_entries_v2";

const initialLeaderboard: LeaderboardEntry[] = [
  { id: "lb-1", name: "Priya", amount: 980, message: "Always happy to help my community.", anonymous: false, isLeaderboardEntry: true },
  { id: "lb-2", anonymous: true, amount: 760, message: "Kindness can be quiet and powerful.", isLeaderboardEntry: true },
  { id: "lb-3", name: "Amit", amount: 650, message: "I believe in community-first support.", anonymous: false, isLeaderboardEntry: true },
  { id: "lb-4", anonymous: true, amount: 540, message: "Every contribution matters.", isLeaderboardEntry: true },
  { id: "lb-5", name: "Sana", amount: 480, message: "Supporting with heart and trust.", anonymous: false, isLeaderboardEntry: true },
  { id: "lb-6", anonymous: true, amount: 420, message: "Grateful to share what I can.", isLeaderboardEntry: true },
  { id: "lb-7", name: "Rohan", amount: 360, message: "Kindness makes our circle stronger.", anonymous: false, isLeaderboardEntry: true },
  { id: "lb-8", anonymous: true, amount: 320, message: "Small actions, huge ripple effects.", isLeaderboardEntry: true },
  { id: "lb-9", name: "Meera", amount: 290, message: "This initiative is close to my heart.", anonymous: false, isLeaderboardEntry: true },
  { id: "lb-10", anonymous: true, amount: 240, message: "Hope and trust lead every contribution.", isLeaderboardEntry: true },
];

type LeaderboardContextValue = {
  entries: LeaderboardEntry[];
  topEntries: LeaderboardEntry[];
  loading: boolean;
  addEntry: (entry: Omit<LeaderboardEntry, "id">) => Promise<void>;
  updateEntry: (id: string, changes: Partial<Omit<LeaderboardEntry, "id">>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  reload: () => Promise<void>;
};

const LeaderboardContext = createContext<LeaderboardContextValue | undefined>(undefined);

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => {
    if (typeof window === "undefined") {
      return initialLeaderboard;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return initialLeaderboard;
      }
      const parsed = JSON.parse(raw) as LeaderboardEntry[];
      return Array.isArray(parsed) ? parsed : initialLeaderboard;
    } catch {
      return initialLeaderboard;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore localStorage failures
    }
  }, [entries]);

  const mapEntry = (entry: {
    _id?: string;
    id?: string;
    contributorName?: string;
    name?: string;
    supportMessage?: string;
    message?: string;
    amount?: number;
    anonymous?: boolean;
    createdAt?: string;
    isLeaderboardEntry?: boolean;
  }): LeaderboardEntry => ({
    id: entry._id || entry.id || `${Date.now()}`,
    name: entry.contributorName || entry.name,
    amount: Number(entry.amount || 0),
    message: entry.supportMessage || entry.message || "",
    anonymous: Boolean(entry.anonymous),
    createdAt: entry.createdAt,
    isLeaderboardEntry: entry.isLeaderboardEntry === true,
  });

  const reload = async () => {
    try {
      setLoading(true);
      const response = await api.get<Array<Parameters<typeof mapEntry>[0]>>("/supporters");
      const responseEntries = Array.isArray(response.data) ? response.data : [];
      const remoteEntries = responseEntries
        .filter((entry) => entry.isLeaderboardEntry === true)
        .map(mapEntry);

      if (remoteEntries.length > 0) {
        setEntries(remoteEntries);
      }
    } catch {
      // Keep the local fallback when the API is unavailable.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const topEntries = useMemo(
    () => [...entries].sort((a, b) => b.amount - a.amount).slice(0, 10),
    [entries]
  );

  const addEntry = async (entry: Omit<LeaderboardEntry, "id">) => {
    const optimisticEntry = {
      id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}`,
      ...entry,
    };

    setEntries((current) => [optimisticEntry, ...current]);

    try {
      const response = await api.post<Parameters<typeof mapEntry>[0]>("/supporters", {
        contributorName: entry.name,
        supportMessage: entry.message,
      amount: entry.amount,
      anonymous: entry.anonymous,
      isLeaderboardEntry: true,
    });
      setEntries((current) => current.map((item) => (item.id === optimisticEntry.id ? mapEntry(response.data) : item)));
    } catch {
      setEntries((current) => current.filter((item) => item.id !== optimisticEntry.id));
      throw new Error("Unable to add leaderboard entry");
    }
  };

  const updateEntry = async (id: string, changes: Partial<Omit<LeaderboardEntry, "id">>) => {
    const previous = entries;
    setEntries((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));

    try {
      await api.put(`/supporters/${id}`, {
        contributorName: changes.name,
        supportMessage: changes.message,
        amount: changes.amount,
        anonymous: changes.anonymous,
      });
    } catch {
      setEntries(previous);
      throw new Error("Unable to update leaderboard entry");
    }
  };

  const deleteEntry = async (id: string) => {
    const previous = entries;
    setEntries((current) => current.filter((item) => item.id !== id));

    try {
      await api.delete(`/supporters/${id}`);
    } catch {
      setEntries(previous);
      throw new Error("Unable to delete leaderboard entry");
    }
  };

  return (
    <LeaderboardContext.Provider value={{ entries, topEntries, loading, addEntry, updateEntry, deleteEntry, reload }}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return context;
}
