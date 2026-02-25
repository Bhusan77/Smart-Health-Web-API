import { handleGetOrderById } from "@/lib/actions/admin/order-action";
import OrderDetails from "../_components/OrderDetails";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const res = await handleGetOrderById(p.id);

  if (!res.success) throw new Error(res.message || "Failed to load order");

  return (
    <div className="p-2">
      <h1 className="text-xl font-semibold mb-3">Order Details</h1>
      <OrderDetails order={res.data} />
    </div>
  );
}