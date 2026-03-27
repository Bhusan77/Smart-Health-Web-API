import axiosServer from "@/lib/api/axios-server";

export async function apiGetAllDoctors(page: string, size: string, search: string) {
  const res = await axiosServer.get(`/api/admin/doctors`, {
    params: { page, size, search },
  });
  return res.data;
}

export async function apiCreateDoctor(payload: any) {
  const res = await axiosServer.post(`/api/admin/doctors`, payload);
  return res.data;
}

export async function apiGetDoctorById(id: string) {
  const res = await axiosServer.get(`/api/admin/doctors/${id}`);
  return res.data;
}

export async function apiUpdateDoctor(id: string, payload: any) {
  const res = await axiosServer.patch(`/api/admin/doctors/${id}`, payload);
  return res.data;
}

export async function apiDeleteDoctor(id: string) {
  const res = await axiosServer.delete(`/api/admin/doctors/${id}`);
  return res.data;
}