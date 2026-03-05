"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleUpdateAppointmentStatus } from "@/lib/actions/admin/appointment-action";

type Appointment = {
  _id: string;
  patient: any; // populated or ObjectId
  doctor: any; // populated or ObjectId
  date: string;
  time?: string; // time only
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  reason?: string;
  cancelReason?: string;
  adminNote?: string;
};

function displayName(x: any) {
  if (!x) return "-";
  if (typeof x === "string") return x;
  return x.name || x.fullName || x.email || x._id || "-";
}

function displayTime(t?: string) {
  if (!t) return "-";
  return t;
}

export default function AppointmentTable({
  appointments,
  pagination,
  search,
  status,
}: {
  appointments: Appointment[];
  pagination: any;
  search: string;
  status: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(search || "");
  const [st, setSt] = useState(status || "");
  const [isPending, startTransition] = useTransition();

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (st) params.set("status", st);
    params.set("page", "1");
    params.set("size", String(pagination?.size || 10));
    router.push(`/admin/appointments?${params.toString()}`);
  };

  const changeStatus = (id: string, newStatus: Appointment["status"]) => {
    let cancelReason = undefined;

    if (newStatus === "CANCELLED") {
      cancelReason = prompt("Cancel reason (optional):") || undefined;
    }

    startTransition(async () => {
      const res = await handleUpdateAppointmentStatus(id, {
        status: newStatus,
        cancelReason,
      });

      if (!res.success) {
        alert(res.message || "Status update failed");
        return;
      }
      router.refresh();
    });
  };

  return (
    // ✅ Light blue page background (works even if your layout is black)
    <div className="mt-2 bg-blue-100 min-h-screen p-4">
      {/* ✅ White card so text is always visible */}
      <div className="border border-blue-200 rounded-xl p-4 bg-white shadow-md">
        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search (patient/doctor)..."
          />

          <select
            value={st}
            onChange={(e) => setSt(e.target.value)}
            className="border border-blue-300 bg-white text-gray-900 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? "Filtering..." : "Filter"}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-200 text-gray-900 text-left border-b border-blue-300">
                <th className="p-2">Patient</th>
                <th className="p-2">Doctor</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments?.map((a) => (
                <tr
                  key={a._id}
                  className="border-b border-blue-100 hover:bg-blue-50 transition"
                >
                  <td className="p-2 text-gray-900 font-medium">
                    {displayName(a.patient)}
                  </td>
                  <td className="p-2 text-gray-900">
                    {displayName(a.doctor)}
                  </td>
                  <td className="p-2 text-gray-900">{a.date}</td>
                  <td className="p-2 text-gray-900">{displayTime(a.time)}</td>

                  <td className="p-2 text-gray-800 font-semibold">{a.status}</td>

                  <td className="p-2 flex gap-2 flex-wrap">
                    {a.status === "PENDING" && (
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition disabled:opacity-60"
                        onClick={() => changeStatus(a._id, "CONFIRMED")}
                        disabled={isPending}
                      >
                        Confirm
                      </button>
                    )}

                    {a.status === "CONFIRMED" && (
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition disabled:opacity-60"
                        onClick={() => changeStatus(a._id, "COMPLETED")}
                        disabled={isPending}
                      >
                        Complete
                      </button>
                    )}

                    {a.status !== "CANCELLED" && a.status !== "COMPLETED" && (
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-60"
                        onClick={() => changeStatus(a._id, "CANCELLED")}
                        disabled={isPending}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {!appointments?.length && (
                <tr>
                  <td className="p-4 text-center text-gray-700" colSpan={6}>
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex gap-2 items-center mt-4">
          <button
            className="bg-white border border-blue-300 text-gray-900 px-3 py-1 rounded hover:bg-blue-50 disabled:opacity-50"
            disabled={!pagination?.hasPrev}
            onClick={() => {
              const params = new URLSearchParams();
              if (q) params.set("search", q);
              if (st) params.set("status", st);
              params.set("page", String((pagination?.page || 1) - 1));
              params.set("size", String(pagination?.size || 10));
              router.push(`/admin/appointments?${params.toString()}`);
            }}
          >
            Prev
          </button>

          <div className="text-gray-900 font-medium">
            Page {pagination?.page || 1} of {pagination?.totalPages || 1}
          </div>

          <button
            className="bg-white border border-blue-300 text-gray-900 px-3 py-1 rounded hover:bg-blue-50 disabled:opacity-50"
            disabled={!pagination?.hasNext}
            onClick={() => {
              const params = new URLSearchParams();
              if (q) params.set("search", q);
              if (st) params.set("status", st);
              params.set("page", String((pagination?.page || 1) + 1));
              params.set("size", String(pagination?.size || 10));
              router.push(`/admin/appointments?${params.toString()}`);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}