"use server";

import axiosServer from "@/lib/api/axios-server";

export async function apiGetAllOrders(filters: { status?: string; user?: string }) {
  const res = await axiosServer.get("/api/admin/orders", { params: filters });
  return res.data;
}

export async function apiGetOrderById(id: string) {
  const res = await axiosServer.get(`/api/admin/orders/${id}`);
  return res.data;
}

export async function apiUpdateOrderStatus(id: string, payload: { status: string }) {
  const res = await axiosServer.patch(`/api/admin/orders/${id}/status`, payload);
  return res.data;
}