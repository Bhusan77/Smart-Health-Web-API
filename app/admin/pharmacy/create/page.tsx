import MedicineForm from "../_components/MedicineForm";

export default function Page() {
  return (
    <div className="p-2">
      <h1 className="text-xl font-semibold mb-3">Add Medicine</h1>
      <MedicineForm mode="create" />
    </div>
  );
}