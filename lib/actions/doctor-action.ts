"use server"

import { DoctorAPI } from "../api/doctor-api"

export const getDoctorsAction = async (q?: string, specialization?: string) => {
  try {
    const res = await DoctorAPI.getDoctors({ q, specialization })
    return res.data // { success: true, doctors }
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch doctors",
      doctors: [],
    }
  }
}

export const getDoctorByIdAction = async (id: string) => {
  try {
    const res = await DoctorAPI.getDoctorById(id)
    return res.data // { success: true, doctor }
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || error?.message || "Failed to fetch doctor",
      doctor: null,
    }
  }
}