"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleCreateMedicine, handleUpdateMedicine } from "@/lib/actions/admin/pharmacy-action";

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
    // ✅ adjust field names to your backend model
    medicineName: initialData?.medicineName || initialData?.name || "",
    price: initialData?.price ?? "",
    stockQty: initialData?.stockQty ?? "",
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
  name: form.medicineName,   // ✅ change key
  price: Number(form.price),
  stock: Number(form.stockQty), // ✅ change key
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
    <form onSubmit={onSubmit} className="border rounded p-4 max-w-xl space-y-3">
      <div>
        <label className="block text-sm mb-1">Medicine Name</label>
        <input
          name="medicineName"
          value={form.medicineName}
          onChange={onChange}
          className="border rounded w-full px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Price</label>
        <input
          name="price"
          value={form.price}
          onChange={onChange}
          className="border rounded w-full px-3 py-2"
          type="number"
          min={0}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Stock Qty</label>
        <input
          name="stockQty"
          value={form.stockQty}
          onChange={onChange}
          className="border rounded w-full px-3 py-2"
          type="number"
          min={0}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Expiry Date</label>
        <input
          name="expiryDate"
          value={form.expiryDate}
          onChange={onChange}
          className="border rounded w-full px-3 py-2"
          placeholder="YYYY-MM-DD"
        />
      </div>

      <div className="flex gap-2">
        <button className="border px-4 py-2 rounded" type="submit" disabled={isPending}>
          {mode === "create" ? "Create" : "Update"}
        </button>
        <button className="border px-4 py-2 rounded" type="button" onClick={() => router.back()} disabled={isPending}>
          Cancel
        </button>
      </div>
    </form>
  );
}