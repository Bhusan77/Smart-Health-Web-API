import MedicineForm from "../../_components/MedicineForm";
import { handleGetMedicineById } from "@/lib/actions/admin/pharmacy-action";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const res = await handleGetMedicineById(p.id);

  if (!res.success) throw new Error(res.message || "Failed to load medicine");

  return (
    <div className="p-2">
      <h1 className="text-xl font-semibold mb-3">Edit Medicine</h1>
      <MedicineForm mode="edit" initialData={res.data} medicineId={p.id} />
    </div>
  );
}