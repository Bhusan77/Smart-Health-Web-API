import axiosInstance from "@/lib/api/axios";

export async function apiGetAllDoctors(page: string, size: string, search: string) {
  const res = await axiosInstance.get(`/api/admin/doctors`, {
    params: { page, size, search },
  });
  return res.data;
}

export async function apiCreateDoctor(payload: any) {
  const res = await axiosInstance.post(`/api/admin/doctors`, payload);
  return res.data;
}

export async function apiGetDoctorById(id: string) {
  const res = await axiosInstance.get(`/api/admin/doctors/${id}`);
  return res.data;
}

export async function apiUpdateDoctor(id: string, payload: any) {
  const res = await axiosInstance.patch(`/api/admin/doctors/${id}`, payload);
  return res.data;
}

export async function apiDeleteDoctor(id: string) {
  const res = await axiosInstance.delete(`/api/admin/doctors/${id}`);
  return res.data;
}