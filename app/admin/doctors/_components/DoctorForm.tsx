// app/admin/doctors/_components/DoctorForm.tsx
"use client";

import { handleCreateDoctor, handleUpdateDoctor } from "@/lib/actions/admin/doctor-action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function DoctorForm({
  mode,
  initialData,
  doctorId,
}: {
  mode: "create" | "edit";
  initialData?: any;
  doctorId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: initialData?.name || "",
    specialization: initialData?.specialization || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    fee: initialData?.fee ?? "",
    isActive: initialData?.isActive ?? true,
  });

  const onChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    startTransition(async () => {
      const payload = {
        ...form,
        fee: form.fee === "" ? undefined : Number(form.fee),
      };

      const res =
        mode === "create"
          ? await handleCreateDoctor(payload)
          : await handleUpdateDoctor(doctorId as string, payload); // ✅ correct

      if (!res?.success) {
        alert(res?.message || "Save failed");
        return;
      }

      router.push("/admin/doctors");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="border rounded p-4 max-w-xl space-y-3">
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          className="border rounded w-full px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Specialization</label>
        <input
          name="specialization"
          value={form.specialization}
          onChange={onChange}
          className="border rounded w-full px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={onChange}
          className="border rounded w-full px-3 py-2"
          type="email"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={onChange}
          className="border rounded w-full px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Fee</label>
        <input
          name="fee"
          value={form.fee}
          onChange={onChange}
          className="border rounded w-full px-3 py-2"
          type="number"
          min={0}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={onChange}
        />
        Active
      </label>

      <div className="flex gap-2">
        <button className="border px-4 py-2 rounded" type="submit" disabled={isPending}>
          {mode === "create" ? "Create" : "Update"}
        </button>

        <button
          className="border px-4 py-2 rounded"
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}