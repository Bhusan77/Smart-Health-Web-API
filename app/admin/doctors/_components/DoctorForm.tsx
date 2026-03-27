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
          : await handleUpdateDoctor(doctorId as string, payload);

      if (!res?.success) {
        alert(res?.message || "Save failed");
        return;
      }

      router.push("/admin/doctors");
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
          {mode === "create" ? "Add Doctor" : "Update Doctor"}
        </h2>

        <div>
          <label className="block text-sm mb-1 text-gray-900 font-medium">
            Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-900 font-medium">
            Specialization
          </label>
          <input
            name="specialization"
            value={form.specialization}
            onChange={onChange}
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-900 font-medium">
            Email
          </label>
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            type="email"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-900 font-medium">
            Phone
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-900 font-medium">
            Fee
          </label>
          <input
            name="fee"
            value={form.fee}
            onChange={onChange}
            className="border border-blue-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            type="number"
            min={0}
          />
        </div>

        {/* Checkbox */}
        <label className="flex items-center gap-2 text-gray-900 font-medium">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={onChange}
            className="h-4 w-4 accent-blue-600"
          />
          Active
        </label>

        {/* Buttons */}
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