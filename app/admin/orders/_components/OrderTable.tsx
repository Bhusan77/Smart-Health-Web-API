"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleUpdateOrderStatus } from "@/lib/actions/admin/order-action";

type Order = {
  _id: string;
  user: any;
  total: number;
  status: "PENDING" | "CONFIRMED" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
};

const userLabel = (u: any) =>
  typeof u === "string" ? u : u?.name || u?.fullName || u?.email || u?._id || "-";

export default function OrderTable({
  orders,
  initialFilters,
}: {
  orders: Order[];
  initialFilters: { status?: string; user?: string };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [status, setStatus] = useState(initialFilters.status || "");
  const [user, setUser] = useState(initialFilters.user || "");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (user) params.set("user", user);
    router.push(`/admin/orders?${params.toString()}`);
  };

  const updateStatus = (id: string, next: Order["status"]) => {
    startTransition(async () => {
      const res = await handleUpdateOrderStatus(id, next);
      if (!res.success) {
        alert(res.message || "Update failed");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="mt-2 bg-blue-100 min-h-screen p-4">
      <div className="border border-blue-200 rounded-xl p-4 bg-white shadow-md">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
          <select
            className="border border-blue-300 bg-white text-gray-900 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <input
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="User ID"
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
            onClick={applyFilters}
            disabled={isPending}
          >
            {isPending ? "Applying..." : "Apply Filters"}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-200 text-gray-900 text-left border-b border-blue-300">
                <th className="p-2">User</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr
                  key={o._id}
                  className="border-b border-blue-100 hover:bg-blue-50 transition"
                >
                  <td className="p-2 text-gray-900 font-medium">
                    {userLabel(o.user)}
                  </td>

                  <td className="p-2 text-gray-900">{o.total}</td>

                  <td className="p-2 text-gray-800 font-semibold">
                    {o.status}
                  </td>

                  <td className="p-2 text-gray-900">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>

                  <td className="p-2 flex gap-2 flex-wrap">
                    <Link
                      className="text-blue-600 font-medium hover:underline"
                      href={`/admin/orders/${o._id}`}
                    >
                      View
                    </Link>

                    {o.status === "PENDING" && (
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition disabled:opacity-60"
                        onClick={() => updateStatus(o._id, "CONFIRMED")}
                        disabled={isPending}
                      >
                        Confirm
                      </button>
                    )}

                    {o.status === "CONFIRMED" && (
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition disabled:opacity-60"
                        onClick={() => updateStatus(o._id, "DISPATCHED")}
                        disabled={isPending}
                      >
                        Dispatch
                      </button>
                    )}

                    {o.status === "DISPATCHED" && (
                      <button
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition disabled:opacity-60"
                        onClick={() => updateStatus(o._id, "DELIVERED")}
                        disabled={isPending}
                      >
                        Deliver
                      </button>
                    )}

                    {o.status !== "CANCELLED" && o.status !== "DELIVERED" && (
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-60"
                        onClick={() => updateStatus(o._id, "CANCELLED")}
                        disabled={isPending}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {!orders.length && (
                <tr>
                  <td className="p-4 text-center text-gray-700" colSpan={5}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}