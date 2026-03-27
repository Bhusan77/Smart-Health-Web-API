"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleDeleteMedicine } from "@/lib/actions/admin/pharmacy-action";

type Medicine = {
  _id: string;
  name: string;
  category?: string;
  price: number;
  stock: number;
  expiryDate?: string;
  description?: string;
};

export default function MedicineTable({
  medicines,
  pagination,
  search,
}: {
  medicines: Medicine[];
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
    router.push(`/admin/pharmacy?${params.toString()}`);
  };

  const onDelete = (id: string) => {
    if (!confirm("Delete this medicine?")) return;

    startTransition(async () => {
      const res = await handleDeleteMedicine(id);
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
            placeholder="Search medicines..."
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
                <th className="p-2">Price</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Expiry</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {medicines?.map((m) => (
                <tr
                  key={m._id}
                  className="border-b border-blue-100 hover:bg-blue-50 transition"
                >
                  <td className="p-2 text-gray-900 font-medium">{m.name}</td>
                  <td className="p-2 text-gray-900">
                    {typeof m.price === "number" ? m.price : "-"}
                  </td>
                  <td className="p-2 text-gray-900">
                    {typeof m.stock === "number" ? m.stock : "-"}
                  </td>
                  <td className="p-2 text-gray-900">{m.expiryDate || "-"}</td>

                  <td className="p-2 flex gap-2">
                    <Link
                      className="text-blue-600 font-medium hover:underline"
                      href={`/admin/pharmacy/${m._id}/edit`}
                    >
                      Edit
                    </Link>

                    <button
                      className="text-red-600 font-medium hover:underline disabled:opacity-60"
                      onClick={() => onDelete(m._id)}
                      disabled={isPending}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!medicines?.length && (
                <tr>
                  <td className="p-4 text-center text-gray-700" colSpan={5}>
                    No medicines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Same style) */}
        <div className="flex gap-2 items-center mt-4">
          <button
            className="bg-white border border-blue-300 text-gray-900 px-3 py-1 rounded hover:bg-blue-50 disabled:opacity-50"
            disabled={!pagination?.hasPrev}
            onClick={() => {
              const params = new URLSearchParams();
              if (q) params.set("search", q);
              params.set("page", String((pagination?.page || 1) - 1));
              params.set("size", String(pagination?.size || 10));
              router.push(`/admin/pharmacy?${params.toString()}`);
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
              router.push(`/admin/pharmacy?${params.toString()}`);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}