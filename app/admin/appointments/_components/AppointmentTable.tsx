"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleUpdateAppointmentStatus } from "@/lib/actions/admin/appointment-action";

type Appointment = {
  _id: string;
  patient: any; // populated or ObjectId
  doctor: any;  // populated or ObjectId
  date: string;
  startTime: string;
  endTime: string;
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
      const res = await handleUpdateAppointmentStatus(id, { status: newStatus, cancelReason });
      if (!res.success) {
        alert(res.message || "Status update failed");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="mt-2 border rounded p-3">
      <div className="flex gap-2 mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Search (patient/doctor)..."
        />
        <select
          value={st}
          onChange={(e) => setSt(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <button onClick={applyFilters} className="border px-4 py-2 rounded" disabled={isPending}>
          Filter
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
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
              <tr key={a._id} className="border-b">
                <td className="p-2">{displayName(a.patient)}</td>
                <td className="p-2">{displayName(a.doctor)}</td>
                <td className="p-2">{a.date}</td>
                <td className="p-2">
                  {a.startTime} - {a.endTime}
                </td>
                <td className="p-2">{a.status}</td>
                <td className="p-2 flex gap-2 flex-wrap">
                  {a.status === "PENDING" && (
                    <button
                      className="border px-3 py-1 rounded"
                      onClick={() => changeStatus(a._id, "CONFIRMED")}
                      disabled={isPending}
                    >
                      Confirm
                    </button>
                  )}
                  {a.status === "CONFIRMED" && (
                    <button
                      className="border px-3 py-1 rounded"
                      onClick={() => changeStatus(a._id, "COMPLETED")}
                      disabled={isPending}
                    >
                      Complete
                    </button>
                  )}
                  {a.status !== "CANCELLED" && a.status !== "COMPLETED" && (
                    <button
                      className="border px-3 py-1 rounded text-red-600"
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
                <td className="p-2" colSpan={6}>
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (same style as doctors) */}
      <div className="flex gap-2 items-center mt-3">
        <button
          className="border px-3 py-1 rounded"
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

        <div className="text-sm">
          Page {pagination?.page || 1} of {pagination?.totalPages || 1}
        </div>

        <button
          className="border px-3 py-1 rounded"
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
  );
}