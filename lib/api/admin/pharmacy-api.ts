import axiosInstance from "@/lib/api/axios";

export async function apiGetAllMedicines(page: string, size: string, search: string) {
  const res = await axiosInstance.get(`/api/admin/pharmacy`, {
    params: { page, size, search },
  });
  return res.data;
}

export async function apiCreateMedicine(payload: any) {
  const res = await axiosInstance.post(`/api/admin/pharmacy`, payload);
  return res.data;
}

export async function apiGetMedicineById(id: string) {
  const res = await axiosInstance.get(`/api/admin/pharmacy/${id}`);
  return res.data;
}

export async function apiUpdateMedicine(id: string, payload: any) {
  // backend usually uses PATCH for updates
  const res = await axiosInstance.patch(`/api/admin/pharmacy/${id}`, payload);
  return res.data;
}

export async function apiDeleteMedicine(id: string) {
  const res = await axiosInstance.delete(`/api/admin/pharmacy/${id}`);
  return res.data;
}