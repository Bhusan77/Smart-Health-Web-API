import axiosServer from "@/lib/api/axios-server";

export async function apiGetAllAppointments(page: string, size: string, search: string, status?: string) {
  const res = await axiosServer.get(`/api/admin/appointments`, {
    params: { page, size, search, status },
  });
  return res.data;
}

export async function apiGetAppointmentById(id: string) {
  const res = await axiosServer.get(`/api/admin/appointments/${id}`);
  return res.data;
}

export async function apiUpdateAppointmentStatus(id: string, payload: { status: string; adminNote?: string; cancelReason?: string }) {
  const res = await axiosServer.patch(`/api/admin/appointments/${id}/status`, payload);
  return res.data;
}

export async function apiRescheduleAppointment(
  id: string,
  payload: { date?: string; time?: string; adminNote?: string }
) {
  const res = await axiosServer.patch(`/api/admin/appointments/${id}/reschedule`, payload);
  return res.data;
}