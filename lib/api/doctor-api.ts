import axiosInstance from "./axios"
import { API } from "./endpoints"

export const DoctorAPI = {
  getDoctors: (params?: { q?: string; specialization?: string }) =>
    axiosInstance.get(API.DOCTORS.LIST, { params }),

  getDoctorById: (id: string) => axiosInstance.get(API.DOCTORS.DETAIL(id)),
}