/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { API } from "../endpoints";
import axiosServer from "../axios-server";

export const createUser = async (userData: FormData) => {
  try {
    const response = await axiosServer.post(API.ADMIN.USER.CREATE, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Create user failed"
    );
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await axiosServer.get(API.ADMIN.USER.GET_ONE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Get user by id failed"
    );
  }
};

export const getAllUsers = async (page: number, size: number, search?: string) => {
  try {
    const response = await axiosServer.get(API.ADMIN.USER.GETALL, {
      params: { page, size, search },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Get all users failed"
    );
  }
};

export const updateUser = async (id: string, updateData: FormData) => {
  try {
    const response = await axiosServer.put(API.ADMIN.USER.UPDATE(id), updateData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Update user failed"
    );
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await axiosServer.put(
      API.ADMIN.USER.UPDATE(profileData.email),
      profileData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || err.message || "Update profile failed"
    );
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axiosServer.delete(API.ADMIN.USER.DELETE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Delete user failed"
    );
  }
};