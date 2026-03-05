"use server";

import { login, register, requestPasswordReset, resetPassword, updateUser } from "@/lib/api/auth";
import { LoginData, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


// ✅ token extractor (handles different backend responses)
const extractToken = (response: any): string | null => {
  return (
    response?.token ||
    response?.data?.token ||
    response?.accessToken ||
    response?.data?.accessToken ||
    response?.jwt ||
    response?.data?.jwt ||
    null
  );
};

export const handleRegister = async (data: RegisterData) => {
  try {
    const response = await register(data);
    if (response.success) {
      return {
        success: true,
        message: "Registration successful",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Registration failed",
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Registration action failed" };
  }
};

export const handleLogin = async (data: LoginData) => {
  try {
    const response = await login(data);

    // ✅ FIX: get real token safely
    const token = extractToken(response);

    if (!response?.success) {
      return {
        success: false,
        message: response?.message || "Login failed",
      };
    }

    // ✅ IMPORTANT: stop saving undefined token
    if (!token) {
      return {
        success: false,
        message: "Login failed: token missing in response",
      };
    }

    await setAuthToken(token);
    await setUserData(response.data);

    return {
      success: true,
      message: "Login successful",
      data: response.data,
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Login action failed" };
  }
};

export const handleLogout = async () => {
  await clearAuthCookies();
  return redirect("/login");
};

export const handleUpdateUser = async (data: FormData) => {
  try {
    const response = await updateUser(data);
    if (response.success) {
      revalidatePath("/user/profile");
      return {
        success: true,
        message: "Update successful",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Update failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Update action failed",
    };
  }
};

export const handleRequestPasswordReset = async (email: string) => {
  try {
    const response = await requestPasswordReset(email);
    if (response.success) {
      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    }
    return { success: false, message: response.message || "Request password reset failed" };
  } catch (error: any) {
    return { success: false, message: error.message || "Request password reset action failed" };
  }
};


export const handleResetPassword = async (token: string, newPassword: string) => {
  try {
    const data = await resetPassword(token, newPassword);
    return { success: !!data?.success, message: data?.message || "" };
  } catch (e: any) {
    return { success: false, message: e?.message || "Reset failed" };
  }
};