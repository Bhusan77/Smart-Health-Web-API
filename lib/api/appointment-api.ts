import axiosInstance from "./axios"

export const AppointmentAPI = {
  create: (payload: any) => axiosInstance.post("/api/appointments", payload),

  // ✅ GET /appointments/me
  getMine: () => axiosInstance.get("/api/appointments/me"),

  // ✅ PATCH /appointments/:id/cancel
  cancel: (id: string, body?: any) => axiosInstance.patch(`/api/appointments/${id}/cancel`, body),
}