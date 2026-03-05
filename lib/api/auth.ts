import { LoginData, RegisterData } from "@/app/(auth)/schema"
import axiosInstance from "./axios"
import { API } from "./endpoints"
import axiosServer from "./axios-server"

export const register = async (registerData: RegisterData) => {
  try {
    const response = await axiosInstance.post(API.AUTH.REGISTER, registerData)
    return response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Registration failed"
    )
  }
}

export const login = async (loginData: LoginData) => {
  try {
    const response = await axiosInstance.post(API.AUTH.LOGIN, loginData)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Login failed")
  }
}

export const updateUser = async (userData: any) => {
  try {
    const response = await axiosInstance.put(API.AUTH.UPDATEPROFILE, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Update user failed")
  }
}

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axiosInstance.post(API.AUTH.REQUEST_PASSWORD_RESET, { email })
    return response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Request password reset failed"
    )
  }
}

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const safeToken = encodeURIComponent(token);

    const res = await axiosServer.post(
      `/api/auth/reset-password/${safeToken}`, // ✅ matches backend
      { newPassword }
    );

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Reset password failed"
    );
  }
};