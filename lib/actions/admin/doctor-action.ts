"use server";

import {
  apiGetAllDoctors,
  apiCreateDoctor,
  apiGetDoctorById,
  apiUpdateDoctor,
  apiDeleteDoctor,
} from "@/lib/api/admin/doctor-api";

export async function handleGetAllDoctors(page: string, size: string, search: string) {
  try {
    const res = await apiGetAllDoctors(page, size, search);
    return {
      success: res.success,
      data: res.data,
      pagination: res.pagination,
      message: res.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message,
    };
  }
}

export async function handleCreateDoctor(payload: any) {
  try {
    const res = await apiCreateDoctor(payload);
    return res;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message,
    };
  }
}

export async function handleUpdateDoctor(id: string, payload: any) {
  try {
    const res = await apiUpdateDoctor(id, payload);
    return res;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message,
    };
  }
}

export async function handleDeleteDoctor(id: string) {
  try {
    const res = await apiDeleteDoctor(id);
    return res;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message,
    };
  }
}

export async function handleGetDoctorById(id: string) {
  try {
    const data = await apiGetDoctorById(id);
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Failed to load doctor",
    };
  }
}