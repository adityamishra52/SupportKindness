import { Link } from "react-router-dom";
import { PageMeta } from "@/components/ui/PageMeta";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <PageMeta title="Page Not Found" />
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 rounded-full bg-emerald-600 px-6 py-2 text-white">Back to Home</Link>
    </div>
  );
}