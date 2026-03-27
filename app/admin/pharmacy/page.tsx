import Link from "next/link";
import { handleGetAllMedicines } from "@/lib/actions/admin/pharmacy-action";
import MedicineTable from "./_components/MedicineTable";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = (params.page as string) || "1";
  const size = (params.size as string) || "10";
  const search = (params.search as string) || "";

  const res = await handleGetAllMedicines(page, size, search);

  if (!res.success) throw new Error(res.message || "Failed to load pharmacy");

  return (
    <div className="p-2">
      <Link className="text-blue-500 border border-blue-500 p-2 rounded inline-block" href="/admin/pharmacy/create">
        Add Medicine
      </Link>

      <MedicineTable medicines={res.data || []} pagination={res.pagination} search={search} />
    </div>
  );
}