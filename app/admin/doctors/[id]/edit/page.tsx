// app/admin/doctors/[id]/edit/page.tsx
import DoctorForm from "../../_components/DoctorForm";
import { handleGetDoctorById } from "@/lib/actions/admin/doctor-action";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const res = await handleGetDoctorById(p.id);

  if (!res.success) {
    throw new Error(res.message || "Failed to load doctor");
  }

  return (
    <div className="p-2">
      <h1 className="text-xl font-semibold mb-3">Edit Doctor</h1>
      <DoctorForm mode="edit" initialData={res.data} doctorId={p.id} />
    </div>
  );
}