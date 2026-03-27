"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  handleCreateMedicine,
  handleUpdateMedicine,
} from "@/lib/actions/admin/pharmacy-action";

export default function MedicineForm({
  mode,
  initialData,
  medicineId,
}: {
  mode: "create" | "edit";
  initialData?: any;
  medicineId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    medicineName: initialData?.medicineName || initialData?.name || "",
    price: initialData?.price ?? "",
    stockQty: initialData?.stockQty ?? initialData?.stock ?? "",
    expiryDate: initialData?.expiryDate || "",
  });

  const onChange = (e: any) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    startTransition(async () => {
      const payload = {
        name: form.medicineName,
        price: Number(form.price),
        stock: Number(form.stockQty),
        expiryDate: form.expiryDate,
      };

      const res =
        mode === "create"
          ? await handleCreateMedicine(payload)
          : await handleUpdateMedicine(medicineId as string, payload);

      if (!res.success) {
        alert(res.message || "Save failed");
        return;
      }

      router.push("/admin/pharmacy");
      router.refresh();
    });
  };

  return (
    <div className="mt-2 bg-blue-100 min-h-screen p-4">
      <form
        onSubmit={onSubmit}
        className="border border-blue-200 rounded-xl p-4 bg-white shadow-md max-w-xl space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          {mode === "create" ? "Add Medicine" : "Update Medicine"}
        </h2>

        <div>
          <label className="block text-sm mb-1 text-gray-900 font-medium">
            Medicine Name
          </label>
          <input
            name="medicineName"
            value={form.medicineName}
            onChange={onChange}
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-900 font-medium">
            Price
          </label>
          <input
            name="price"
            value={form.price}
            onChange={onChange}
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            type="number"
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-900 font-medium">
            Stock Qty
          </label>
          <input
            name="stockQty"
            value={form.stockQty}
            onChange={onChange}
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            type="number"
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-900 font-medium">
            Expiry Date
          </label>
          <input
            name="expiryDate"
            value={form.expiryDate}
            onChange={onChange}
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="YYYY-MM-DD"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving..." : mode === "create" ? "Create" : "Update"}
          </button>

          <button
            className="bg-white border border-blue-300 text-gray-900 px-4 py-2 rounded hover:bg-blue-50 transition disabled:opacity-50"
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}