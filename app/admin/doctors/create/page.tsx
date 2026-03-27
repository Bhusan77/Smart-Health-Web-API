// app/admin/doctors/create/page.tsx
import DoctorForm from "../_components/DoctorForm";

export default function Page() {
  return (
    <div className="p-2">
      <h1 className="text-xl font-semibold mb-3">Create Doctor</h1>
      <DoctorForm mode="create" />
    </div>
  );
}