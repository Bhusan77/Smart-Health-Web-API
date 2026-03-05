"use client";

export default function OrderDetails({ order }: { order: any }) {
  const user = order?.user;
  const items = order?.items || [];

  return (
    <div className="mt-2 bg-blue-100 min-h-screen p-4">
      <div className="border border-blue-200 rounded-xl p-4 bg-white shadow-md space-y-4">

        {/* Order Info */}
        <div className="text-sm text-gray-900 space-y-1">
          <div><b>Order ID:</b> {order?._id}</div>
          <div><b>Status:</b> {order?.status}</div>
          <div><b>Total:</b> {order?.total}</div>
          <div><b>Delivery Address:</b> {order?.deliveryAddress || "-"}</div>
        </div>

        {/* User Section */}
        <div className="border-t border-blue-200 pt-3 text-sm text-gray-900">
          <div className="font-semibold mb-1">User</div>
          <div>
            {user?.name || user?.fullName || "-"} ({user?.email || "-"})
          </div>
        </div>

        {/* Items Section */}
        <div className="border-t border-blue-200 pt-3">
          <div className="font-semibold mb-2 text-gray-900">Items</div>

          <div className="overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-200 text-gray-900 text-left border-b border-blue-300">
                  <th className="p-2">Medicine</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {items.map((it: any, idx: number) => {
                  const med = it.medicine;
                  const medName =
                    typeof med === "string"
                      ? med
                      : med?.name || med?._id;

                  const subtotal =
                    (it.qty || 0) * (it.priceAtPurchase || 0);

                  return (
                    <tr
                      key={idx}
                      className="border-b border-blue-100 hover:bg-blue-50 transition"
                    >
                      <td className="p-2 text-gray-900 font-medium">
                        {medName}
                      </td>
                      <td className="p-2 text-gray-900">{it.qty}</td>
                      <td className="p-2 text-gray-900">
                        {it.priceAtPurchase}
                      </td>
                      <td className="p-2 text-gray-900 font-semibold">
                        {subtotal}
                      </td>
                    </tr>
                  );
                })}

                {!items.length && (
                  <tr>
                    <td
                      className="p-4 text-center text-gray-700"
                      colSpan={4}
                    >
                      No items.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}