import { Link, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiDownload, FiXCircle } from "react-icons/fi";
import { PageMeta } from "@/components/ui/PageMeta";
import { siteConfig } from "@/config/siteConfig";

export default function DonationStatusPage({ status }: { status: "success" | "failure" }) {
  const [params] = useSearchParams();
  const amount = params.get("amount") || "0";
  const reference = params.get("ref") || `CC-${Date.now()}`;
  const isSuccess = status === "success";

  const downloadReceipt = () => {
    const receipt = [
      `${siteConfig.appName} Donation Receipt`,
      `Status: ${isSuccess ? "Successful" : "Failed"}`,
      `Amount: INR ${amount}`,
      `Reference: ${reference}`,
      `Date: ${new Date().toLocaleString()}`,
      "Thank you for supporting community care.",
    ].join("\n");

    const url = URL.createObjectURL(new Blob([receipt], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${siteConfig.appName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-receipt-${reference}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-6 py-16">
      <PageMeta title={isSuccess ? "Donation Successful" : "Donation Failed"} />
      <section className="glass-surface w-full rounded-[2rem] p-8 text-center sm:p-12">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${isSuccess ? "bg-emerald-500/15 text-emerald-500" : "bg-rose-500/15 text-rose-500"}`}>
          {isSuccess ? <FiCheckCircle className="h-10 w-10" /> : <FiXCircle className="h-10 w-10" />}
        </div>
        <h1 className="mt-6 text-4xl font-black text-slate-900 dark:text-white">
          {isSuccess ? "Donation Recorded" : "Donation Could Not Be Completed"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
          {isSuccess
            ? "Your support has been recorded. Keep the receipt for your own records."
            : "No donation was recorded. You can retry from the support page whenever you are ready."}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {isSuccess && (
            <button
              type="button"
              onClick={downloadReceipt}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 font-semibold text-white"
            >
              <FiDownload /> Download Receipt
            </button>
          )}
          <Link
            to="/support-us"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 dark:border-white/15 dark:text-slate-100"
          >
            Return to Support
          </Link>
        </div>
      </section>
    </main>
  );
}
