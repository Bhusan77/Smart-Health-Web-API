"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentFailurePage() {
  const sp = useSearchParams();
  const router = useRouter();

  const pid = useMemo(() => sp.get("pid") || sp.get("oid") || "", [sp]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/30 p-6 space-y-4">
        <h1 className="text-xl font-semibold">Payment Failed</h1>

        <p className="text-sm opacity-80">
          Payment was cancelled or failed. If money was deducted, contact support with your pid.
        </p>

        <div className="text-xs opacity-60 break-all">pid: {pid || "-"}</div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/user/orders")}
            className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 text-sm"
          >
            My Orders
          </button>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl bg-white text-black text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}