import axiosInstance from "@/lib/api/axios";

export async function apiGetAllOrders(filters: { status?: string; user?: string }) {
  const res = await axiosInstance.get("/api/admin/orders", { params: filters });
  return res.data;
}

export async function apiGetOrderById(id: string) {
  const res = await axiosInstance.get(`/api/admin/orders/${id}`);
  return res.data;
}

export async function apiUpdateOrderStatus(id: string, payload: { status: string }) {
  const res = await axiosInstance.patch(`/api/admin/orders/${id}/status`, payload);
  return res.data;
}