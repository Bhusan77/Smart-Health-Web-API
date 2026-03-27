"use server";

import axios from "axios";
import { getAuthToken } from "@/lib/cookie"; // server cookies()

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const axiosServer = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosServer.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();

    // ✅ avoid sending Bearer undefined / null
    if (token && token !== "undefined" && token !== "null") {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosServer;