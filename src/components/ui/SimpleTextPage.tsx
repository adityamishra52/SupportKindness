import { PageMeta } from "@/components/ui/PageMeta";

export function SimpleTextPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14">
      <PageMeta title={title} />
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">{body}</p>
      <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
        This is a personal community support initiative, not a registered NGO.
      </p>
    </div>
  );
}
