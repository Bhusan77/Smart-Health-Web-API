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
    <div className="mt-4 border rounded p-3">
      <div className="flex gap-2 mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Search medicines..."
        />
        <button onClick={onSearch} className="border px-4 py-2 rounded" disabled={isPending}>
          Search
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Expiry</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((m) => (
              <tr key={m._id} className="border-b">
                <td className="p-2">{m.name}</td>
                <td className="p-2">{typeof m.price === "number" ? m.price : "-"}</td>
                <td className="p-2">{typeof m.stock === "number" ? m.stock : "-"}</td>
                <td className="p-2">{m.expiryDate || "-"}</td>
                <td className="p-2 flex gap-2">
                  <Link className="text-blue-600" href={`/admin/pharmacy/${m._id}/edit`}>
                    Edit
                  </Link>
                  <button
                    className="text-red-600"
                    onClick={() => onDelete(m._id)}
                    disabled={isPending}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!medicines.length && (
              <tr>
                <td className="p-2" colSpan={5}>
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}