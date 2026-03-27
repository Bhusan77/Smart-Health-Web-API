// app/admin/doctors/page.tsx
import Link from "next/link";
import { handleGetAllDoctors } from "@/lib/actions/admin/doctor-action";
import DoctorTable from "./_components/DoctorTable";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = (params.page as string) || "1";
  const size = (params.size as string) || "10";
  const search = (params.search as string) || "";

  const response = await handleGetAllDoctors(page, size, search);

  if (!response.success) {
    throw new Error(response.message || "Failed to load doctors");
  }

  return (
    <div className="p-2">
      <Link
        className="text-blue-500 border border-blue-500 p-2 rounded inline-block"
        href="/admin/doctors/create"
      >
        Create Doctor
      </Link>

      <DoctorTable doctors={response.data} pagination={response.pagination} search={search} />
    </div>
  );
}