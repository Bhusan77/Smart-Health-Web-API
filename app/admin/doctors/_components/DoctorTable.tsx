// app/admin/doctors/_components/DoctorTable.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleDeleteDoctor } from "@/lib/actions/admin/doctor-action";

type Doctor = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  specialization: string;
  fee?: number;
  isActive?: boolean;
};

export default function DoctorTable({
  doctors,
  pagination,
  search,
}: {
  doctors: Doctor[];
  pagination: any;
  search: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(search || "");
  const [isPending, startTransition] = useTransition();

  const onSearch = () => {
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    params.set("page", "1");
    params.set("size", String(pagination?.size || 10));
    router.push(`/admin/doctors?${params.toString()}`);
  };

  const onDelete = (id: string) => {
    const ok = confirm("Delete this doctor?");
    if (!ok) return;

    startTransition(async () => {
      const res = await handleDeleteDoctor(id);
      if (!res.success) {
        alert(res.message || "Delete failed");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="mt-4 border rounded p-3">
      <div className="flex gap-2 mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Search doctors..."
        />
        <button
          onClick={onSearch}
          className="border px-4 py-2 rounded"
          disabled={isPending}
        >
          Search
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Specialization</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Fee</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors?.map((d) => (
              <tr key={d._id} className="border-b">
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.specialization}</td>
                <td className="p-2">{d.email || "-"}</td>
                <td className="p-2">{d.phone || "-"}</td>
                <td className="p-2">{typeof d.fee === "number" ? d.fee : "-"}</td>
                <td className="p-2">{d.isActive ? "Yes" : "No"}</td>
                <td className="p-2 flex gap-2">
                  <Link className="text-blue-600" href={`/admin/doctors/${d._id}/edit`}>
                    Edit
                  </Link>
                  <button className="text-red-600" onClick={() => onDelete(d._id)} disabled={isPending}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!doctors?.length && (
              <tr>
                <td className="p-2" colSpan={7}>
                  No doctors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (basic) */}
      <div className="flex gap-2 items-center mt-3">
        <button
          className="border px-3 py-1 rounded"
          disabled={!pagination?.hasPrev}
          onClick={() => {
            const params = new URLSearchParams();
            if (q) params.set("search", q);
            params.set("page", String((pagination?.page || 1) - 1));
            params.set("size", String(pagination?.size || 10));
            router.push(`/admin/doctors?${params.toString()}`);
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
            params.set("page", String((pagination?.page || 1) + 1));
            params.set("size", String(pagination?.size || 10));
            router.push(`/admin/doctors?${params.toString()}`);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}