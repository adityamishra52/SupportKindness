import { useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  FiAward,
  FiEdit3,
  FiHeart,
  FiSearch,
  FiTrash2,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import { PageMeta } from "@/components/ui/PageMeta";
import { useLeaderboard, type LeaderboardEntry } from "@/context/LeaderboardContext";

const defaultFormState = {
  name: "",
  amount: "500",
  message: "",
  anonymous: false,
};

function AdminStat({ label, value, icon: Icon }: {
  label: string;
  value: string | number;
  icon: typeof FiUsers;
}) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10151d]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </motion.article>
  );
}

export default function SupportLeaderboardAdminPage() {
  const { entries, addEntry, updateEntry, deleteEntry } = useLeaderboard();
  const [editId, setEditId] = useState<string | null>(null);
  const [formState, setFormState] = useState(defaultFormState);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<LeaderboardEntry | null>(null);

  const sortedEntries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return [...entries]
      .filter((entry) => {
        if (!query) return true;
        return `${entry.name || ""} ${entry.message} ${entry.amount}`.toLowerCase().includes(query);
      })
      .sort((a, b) => b.amount - a.amount);
  }, [entries, searchTerm]);

  const totalRaised = useMemo(
    () => sortedEntries.reduce((sum, entry) => sum + entry.amount, 0),
    [sortedEntries]
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const amountValue = Number(formState.amount);

    if (!formState.message.trim()) {
      setAdminMessage("Please add a message for the leaderboard entry.");
      return;
    }

    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setAdminMessage("Please enter a valid amount.");
      return;
    }

    const payload: Omit<LeaderboardEntry, "id"> = {
      name: formState.name.trim() || undefined,
      amount: amountValue,
      message: formState.message.trim(),
      anonymous: formState.anonymous,
    };

    try {
      if (editId) {
        await updateEntry(editId, payload);
        setAdminMessage("Leaderboard entry updated successfully.");
      } else {
        await addEntry(payload);
        setAdminMessage("Leaderboard entry added successfully.");
      }

      setEditId(null);
      setFormState(defaultFormState);
    } catch {
      setAdminMessage("Unable to save leaderboard entry. Please check admin credentials and backend connection.");
    }
  };

  const handleEdit = (entry: LeaderboardEntry) => {
    setEditId(entry.id);
    setFormState({
      name: entry.name ?? "",
      amount: entry.amount.toString(),
      message: entry.message,
      anonymous: entry.anonymous ?? false,
    });
    setAdminMessage(null);
  };

  const handleCancel = () => {
    setEditId(null);
    setFormState(defaultFormState);
    setAdminMessage(null);
  };

  return (
    <div className="space-y-6">
      <PageMeta
        title="Support Leaderboard Admin"
        description="Manage leaderboard support entries, donations, and community recognition from the admin dashboard."
        keywords="admin dashboard, leaderboard management, donation admin, support entries"
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10151d] sm:p-6">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Support Operations</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Support Leaderboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Manage supporter visibility, donation entries, and public recognition from one focused workspace.
            </p>
          </div>
          <label className="relative block w-full max-w-md">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search supporters, messages, or amounts"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-white/10"
            />
          </label>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat label="Total Supporters" value={sortedEntries.length} icon={FiUsers} />
        <AdminStat label="Total Raised" value={`INR ${totalRaised}`} icon={FiTrendingUp} />
        <AdminStat label="Top Donation" value={`INR ${sortedEntries[0]?.amount || 0}`} icon={FiAward} />
        <AdminStat label="Public Status" value="Active" icon={FiHeart} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#10151d]">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-white/10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Records</p>
              <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">Leaderboard Entries</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">{sortedEntries.length} rows</span>
          </div>

          <div className="max-h-[36rem] overflow-auto">
            <table className="min-w-[760px] w-full text-left">
              <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:bg-[#0d1117] dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Rank</th>
                  <th className="px-5 py-3">Supporter</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Message</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {sortedEntries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                      No supporter records match your search.
                    </td>
                  </tr>
                )}
                {sortedEntries.map((entry, index) => (
                  <tr key={entry.id} className="transition hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                    <td className="px-5 py-4 font-bold text-slate-950 dark:text-white">#{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">
                          {(entry.anonymous ? "A" : entry.name?.[0] || "S").toUpperCase()}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-950 dark:text-white">{entry.anonymous ? "Anonymous Supporter" : entry.name || "Supporter"}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{entry.anonymous ? "Private" : "Public"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-300">INR {entry.amount}</td>
                    <td className="max-w-sm px-5 py-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      <span className="line-clamp-2">{entry.message}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => handleEdit(entry)} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/[0.1]">
                          <FiEdit3 className="h-4 w-4" />
                          Edit
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(entry)} className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-400/10 dark:text-rose-300">
                          <FiTrash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-6">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10151d]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{editId ? "Edit Entry" : "Add Entry"}</p>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Supporter Name</span>
                <input value={formState.name} onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))} placeholder="Name or leave blank" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-white/10" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Amount</span>
                <input type="number" min="1" value={formState.amount} onChange={(event) => setFormState((state) => ({ ...state, amount: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-white/10" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Message</span>
                <textarea rows={5} value={formState.message} onChange={(event) => setFormState((state) => ({ ...state, message: event.target.value }))} placeholder="Support note shown publicly" className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:ring-white/10" />
              </label>
              <label className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={formState.anonymous} onChange={(event) => setFormState((state) => ({ ...state, anonymous: event.target.checked }))} className="h-5 w-5 rounded border-slate-300 text-slate-950 focus:ring-slate-400" />
                Mark as anonymous
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                {editId ? "Update Entry" : "Add Entry"}
              </button>
              {editId && <button type="button" onClick={handleCancel} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.06]">Cancel</button>}
            </div>
            {adminMessage && <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{adminMessage}</p>}
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10151d]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Public Preview</p>
            <div className="mt-5 space-y-3">
              {sortedEntries.slice(0, 4).map((entry, index) => (
                <div key={entry.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">#{index + 1}</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-300">INR {entry.amount}</p>
                  </div>
                  <p className="mt-2 font-bold text-slate-950 dark:text-white">{entry.anonymous ? "Anonymous Supporter" : entry.name || "Supporter"}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{entry.message}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#10151d]">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">Delete supporter entry?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              This removes {deleteTarget.anonymous ? "Anonymous Supporter" : deleteTarget.name || "Supporter"} from the leaderboard.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.06]">
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteEntry(deleteTarget.id);
                    setDeleteTarget(null);
                    setAdminMessage("Leaderboard entry deleted successfully.");
                  } catch {
                    setDeleteTarget(null);
                    setAdminMessage("Unable to delete leaderboard entry. Please check admin credentials and backend connection.");
                  }
                }}
                className="rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
