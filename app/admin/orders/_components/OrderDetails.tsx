"use client";

export default function OrderDetails({ order }: { order: any }) {
  const user = order?.user;
  const items = order?.items || [];

  return (
    <div className="border rounded p-4 space-y-3">
      <div className="text-sm">
        <div><b>Order ID:</b> {order?._id}</div>
        <div><b>Status:</b> {order?.status}</div>
        <div><b>Total:</b> {order?.total}</div>
        <div><b>Delivery Address:</b> {order?.deliveryAddress || "-"}</div>
      </div>

      <div className="border-t pt-3 text-sm">
        <div className="font-semibold mb-1">User</div>
        <div>{user?.name || user?.fullName || "-"} ({user?.email || "-"})</div>
      </div>

      <div className="border-t pt-3">
        <div className="font-semibold mb-2">Items</div>
        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Medicine</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Price</th>
                <th className="p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it: any, idx: number) => {
                const med = it.medicine;
                const medName = typeof med === "string" ? med : med?.name || med?._id;
                const subtotal = (it.qty || 0) * (it.priceAtPurchase || 0);
                return (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{medName}</td>
                    <td className="p-2">{it.qty}</td>
                    <td className="p-2">{it.priceAtPurchase}</td>
                    <td className="p-2">{subtotal}</td>
                  </tr>
                );
              })}
              {!items.length && (
                <tr>
                  <td className="p-2" colSpan={4}>
                    No items.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}