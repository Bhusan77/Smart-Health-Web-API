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
    <div className="mt-2 bg-blue-100 min-h-screen p-4">
      <div className="border border-blue-200 rounded-xl p-4 bg-white shadow-md">

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search doctors..."
          />
          <button
            onClick={onSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-200 text-gray-900 text-left border-b border-blue-300">
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
                <tr
                  key={d._id}
                  className="border-b border-blue-100 hover:bg-blue-50 transition"
                >
                  <td className="p-2 text-gray-900 font-medium">{d.name}</td>
                  <td className="p-2 text-gray-900">{d.specialization}</td>
                  <td className="p-2 text-gray-900">{d.email || "-"}</td>
                  <td className="p-2 text-gray-900">{d.phone || "-"}</td>
                  <td className="p-2 text-gray-900">
                    {typeof d.fee === "number" ? d.fee : "-"}
                  </td>
                  <td className="p-2 text-gray-900">
                    {d.isActive ? "Yes" : "No"}
                  </td>
                  <td className="p-2 flex gap-2">
                    <Link
                      className="text-blue-600 font-medium hover:underline"
                      href={`/admin/doctors/${d._id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      className="text-red-600 font-medium hover:underline disabled:opacity-60"
                      onClick={() => onDelete(d._id)}
                      disabled={isPending}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!doctors?.length && (
                <tr>
                  <td
                    className="p-4 text-center text-gray-700"
                    colSpan={7}
                  >
                    No doctors found.
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
              params.set("page", String((pagination?.page || 1) - 1));
              params.set("size", String(pagination?.size || 10));
              router.push(`/admin/doctors?${params.toString()}`);
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
              params.set("page", String((pagination?.page || 1) + 1));
              params.set("size", String(pagination?.size || 10));
              router.push(`/admin/doctors?${params.toString()}`);
            }}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}