"use server";

import {
  apiGetAllMedicines,
  apiCreateMedicine,
  apiGetMedicineById,
  apiUpdateMedicine,
  apiDeleteMedicine,
} from "@/lib/api/admin/pharmacy-api";

export async function handleGetAllMedicines(page: string, size: string, search: string) {
  try {
    const res = await apiGetAllMedicines(page, size, search);

    // ✅ supports different backend keys safely:
    const list = res.data || res.medicines || res.items || res.pharmacy || [];
    return {
      success: res.success,
      data: list,
      pagination: res.pagination,
      message: res.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Failed to load medicines",
    };
  }
}

export async function handleCreateMedicine(payload: any) {
  try {
    const res = await apiCreateMedicine(payload);
    return { success: res.success, data: res.data || res.medicine || res.item, message: res.message };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Failed to create medicine",
    };
  }
}

export async function handleGetMedicineById(id: string) {
  try {
    const res = await apiGetMedicineById(id);
    return { success: res.success, data: res.data || res.medicine || res.item, message: res.message };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Failed to load medicine",
    };
  }
}

export async function handleUpdateMedicine(id: string, payload: any) {
  try {
    const res = await apiUpdateMedicine(id, payload);
    return { success: res.success, data: res.data || res.medicine || res.item, message: res.message };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Failed to update medicine",
    };
  }
}

export async function handleDeleteMedicine(id: string) {
  try {
    const res = await apiDeleteMedicine(id);
    return { success: res.success, message: res.message };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Failed to delete medicine",
    };
  }
}