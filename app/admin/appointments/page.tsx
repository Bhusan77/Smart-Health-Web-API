import { handleGetAllAppointments } from "@/lib/actions/admin/appointment-action";
import AppointmentTable from "./_components/AppointmentTable";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const page = (params.page as string) || "1";
  const size = (params.size as string) || "10";
  const search = (params.search as string) || "";
  const status = (params.status as string) || "";

  const response = await handleGetAllAppointments(page, size, search, status || undefined);

  if (!response.success) {
    throw new Error(response.message || "Failed to load appointments");
  }

  return (
    <div className="p-2">
      <AppointmentTable
        appointments={response.data || []}
        pagination={response.pagination}
        search={search}
        status={status}
      />
    </div>
  );
}