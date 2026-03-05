"use client";

import { useEffect, useState } from "react";
import { startEsewaPayment } from "@/lib/api/payment/esewa";
import { getAuthTokenClient } from "@/lib/cookie-client";

type OrderItem = {
  medicine: any;
  qty: number;
  priceAtPurchase: number;
};

type Order = {
  _id: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
  deliveryAddress?: string;
  items: OrderItem[];
  createdAt?: string;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [payingId, setPayingId] = useState<string>("");

  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const load = async () => {
    try {
      setErr("");
      setLoading(true);

      const token = getAuthTokenClient(); 
      if (!token) throw new Error("You are not logged in");

      const res = await fetch(`${base}/api/pharmacy/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load orders");
      }

      setOrders(data.orders || []);
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  
  }, []);

  const payNow = async (orderId: string) => {
    try {
      setErr("");
      setPayingId(orderId);

      const token = getAuthTokenClient(); 
      if (!token) throw new Error("You are not logged in");

      await startEsewaPayment(orderId, token);
    } catch (e: any) {
   
      const msg = String(e?.message || "Payment error");
      if (msg.toLowerCase().includes("dns") || msg.toLowerCase().includes("nxdomain")) {
        setErr("eSewa test server (UAT) is not reachable from your network right now. Try later.");
      } else {
        setErr(msg);
      }
      setPayingId("");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">My Orders</h1>
          <button
            onClick={load}
            className="px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 text-sm"
          >
            Refresh
          </button>
        </div>

    
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm opacity-80">
          Note: EPAYTEST works only on eSewa UAT. If UAT is down / not resolving, payment may not open.
        </div>

        {err ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
            {err}
          </div>
        ) : null}

        {loading ? (
          <div className="text-sm opacity-70">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-sm opacity-70">No orders found.</div>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => (
              <div
                key={o._id}
                className="rounded-2xl border border-white/10 bg-black/30 p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm opacity-70 break-all">Order ID: {o._id}</div>

                  <div className="text-sm">
                    Status:{" "}
                    <span className="font-semibold">
                      {o.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm opacity-80">
                    Total: <span className="font-semibold">Rs {o.total}</span>
                  </div>

                  {o.status === "PENDING" ? (
                    <button
                      onClick={() => payNow(o._id)}
                      disabled={payingId === o._id}
                      className="px-4 py-2 rounded-xl bg-white text-black text-sm disabled:opacity-60"
                    >
                      {payingId === o._id ? "Redirecting..." : "Pay with eSewa"}
                    </button>
                  ) : null}
                </div>

                {o.deliveryAddress ? (
                  <div className="text-sm opacity-70">
                    Address: <span className="opacity-90">{o.deliveryAddress}</span>
                  </div>
                ) : null}

                <div className="text-sm opacity-80">
                  Items: <span className="font-semibold">{o.items?.length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}