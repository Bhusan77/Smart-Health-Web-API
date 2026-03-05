"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const pid = useMemo(() => sp.get("pid") || sp.get("oid") || "", [sp]);
  const refId = useMemo(
    () => sp.get("refId") || sp.get("refid") || sp.get("ref") || "",
    [sp]
  );

  const [state, setState] = useState<"loading" | "ok" | "fail">("loading");
  const [msg, setMsg] = useState("Verifying payment...");

  useEffect(() => {
    const run = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!base) throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");

        if (!pid || !refId) {
          setState("fail");
          setMsg("Missing pid/refId in URL");
          return;
        }

        const url =
          `${base}/api/payments/esewa/success?pid=${encodeURIComponent(
            pid
          )}&refId=${encodeURIComponent(refId)}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok || !data?.success) {
          setState("fail");
          setMsg(data?.message || "Verification failed");
          return;
        }

        setState("ok");
        setMsg("Payment verified ✅ Your order is CONFIRMED");
      } catch (e: any) {
        setState("fail");
        setMsg(e?.message || "Verification error");
      }
    };

    run();
  }, [pid, refId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/30 p-6 space-y-4">
        <h1 className="text-xl font-semibold">
          {state === "ok" ? "Payment Success" : state === "fail" ? "Payment Problem" : "Processing"}
        </h1>

        <p className="text-sm opacity-80">{msg}</p>

        <div className="text-xs opacity-60 break-all">
          <div>pid: {pid || "-"}</div>
          <div>refId: {refId || "-"}</div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/user/orders")}
            className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 text-sm"
          >
            Go to My Orders
          </button>

          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-xl bg-white text-black text-sm"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}