import { handleGetAllOrders } from "@/lib/actions/admin/order-action";
import OrderTable from "./_components/OrderTable";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const status = (params.status as string) || "";
  const user = (params.user as string) || "";

  const res = await handleGetAllOrders({ status: status || undefined, user: user || undefined });

  if (!res.success) throw new Error(res.message || "Failed to load orders");

  return (
    <div className="p-2">
      <h1 className="text-xl font-semibold mb-3">Orders</h1>
      <OrderTable orders={res.data || []} initialFilters={{ status, user }} />
    </div>
  );
}