"use server";

import {
  apiGetAllAppointments,
  apiGetAppointmentById,
  apiUpdateAppointmentStatus,
  apiRescheduleAppointment,
} from "@/lib/api/admin/appointment-api";

export async function handleGetAllAppointments(page: string, size: string, search: string, status?: string) {
  try {
    const res = await apiGetAllAppointments(page, size, search, status);
    return {
      success: res.success,
      data: res.appointments,      // ✅ map
      pagination: res.pagination,  // if your service sends it
      message: res.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Failed to load appointments",
    };
  }
}

export async function handleGetAppointmentById(id: string) {
  try {
    const res = await apiGetAppointmentById(id);
    return {
      success: res.success,
      data: res.appointment, // ✅ map
      message: res.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Failed to load appointment",
    };
  }
}

export async function handleUpdateAppointmentStatus(id: string, payload: any) {
  try {
    const res = await apiUpdateAppointmentStatus(id, payload);
    return {
      success: res.success,
      data: res.appointment, // ✅ map
      message: res.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Failed to update status",
    };
  }
}

export async function handleRescheduleAppointment(id: string, payload: any) {
  try {
    const res = await apiRescheduleAppointment(id, payload);
    return {
      success: res.success,
      data: res.appointment, // ✅ map
      message: res.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Failed to reschedule appointment",
    };
  }
}