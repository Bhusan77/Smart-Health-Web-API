"use server";
import { apiGetAllOrders, apiGetOrderById, apiUpdateOrderStatus } from "@/lib/api/admin/order-api";

export async function handleGetAllOrders(filters: any) {
  try {
    const res = await apiGetAllOrders(filters);
    return res; // { success, data }
  } catch (err: any) {
    return { success: false, message: err?.response?.data?.message || err?.message || "Failed to load orders" };
  }
}

export async function handleGetOrderById(id: string) {
  try {
    const res = await apiGetOrderById(id);
    return res;
  } catch (err: any) {
    return { success: false, message: err?.response?.data?.message || err?.message || "Failed to load order" };
  }
}

export async function handleUpdateOrderStatus(id: string, status: string) {
  try {
    const res = await apiUpdateOrderStatus(id, { status });
    return res;
  } catch (err: any) {
    return { success: false, message: err?.response?.data?.message || err?.message || "Failed to update status" };
  }
}