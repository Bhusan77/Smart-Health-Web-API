import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

export const PharmacyAPI = {
  getMedicines: async () => {
    return axiosInstance.get(API.PHARMACY.MEDICINES);
  },

  createOrder: async (payload: {
    items: { medicine: string; qty: number }[];
    deliveryAddress?: string;
  }) => {
    return axiosInstance.post(API.PHARMACY.CREATE_ORDER, payload);
  },

  myOrders: async () => {
    return axiosInstance.get(API.PHARMACY.MY_ORDERS);
  },
};