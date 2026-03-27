"use client";
import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { handleCreateUser } from "@/lib/actions/admin/user-action";

export default function CreateUserForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image preview
  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit handler
  const onSubmit = async (data: UserData) => {
    setError(null);

    try {
      const formData = new FormData();

      // ✅ IMPORTANT: send username to backend
      formData.append("username", data.username);

      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      if (data.profile) {
        formData.append("profile", data.profile); // MUST match backend field name
      }

      const response = await handleCreateUser(formData);

      if (!response?.success) {
        throw new Error(response?.message || "User creation failed");
      }

      reset();
      handleDismissImage();
      alert("User created successfully");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm"
    >
      {/* Image Preview */}
      <div className="flex items-center gap-4">
        {previewImage ? (
          <div className="relative w-24 h-24">
            <img
              src={previewImage}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-emerald-400"
            />
            <Controller
              name="profile"
              control={control}
              render={({ field: { onChange } }) => (
                <button
                  type="button"
                  onClick={() => handleDismissImage(onChange)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
            <span className="text-emerald-500 text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-emerald-700 mb-1">
          Profile Image
        </label>
        <Controller
          name="profile"
          control={control}
          render={({ field: { onChange } }) => (
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
              className="block w-full text-sm text-black
                file:mr-4 file:rounded-md file:border-0
                file:bg-emerald-100 file:px-4 file:py-2
                file:text-sm file:font-medium
                file:text-emerald-700 hover:file:bg-emerald-200"
            />
          )}
        />
        {errors.profile && (
          <p className="text-xs text-red-600">{errors.profile.message as any}</p>
        )}
      </div>

      {/* ✅ Username */}
      <div>
        <label className="text-sm font-medium text-emerald-700">
          Username
        </label>
        <input
          {...register("username")}
          type="text"
          placeholder="e.g. aayush_123"
          className="h-10 w-full rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm text-black placeholder:text-gray-400 outline-none focus:border-emerald-400"
        />
        {errors.username && (
          <p className="text-xs text-red-600">{errors.username.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-emerald-700">Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className="h-10 w-full rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm text-black placeholder:text-gray-400 outline-none focus:border-emerald-400"
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-medium text-sky-700">Password</label>
        <input
          {...register("password")}
          type="password"
          className="h-10 w-full rounded-md border border-sky-200 bg-sky-50 px-3 text-sm text-black outline-none focus:border-sky-400"
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-sm font-medium text-sky-700">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          className="h-10 w-full rounded-md border border-sky-200 bg-sky-50 px-3 text-sm text-black outline-none focus:border-sky-400"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Global Error */}
      {error && <p className="text-sm text-center text-red-600">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-md bg-gradient-to-r from-emerald-500 to-sky-500 text-white text-sm font-semibold shadow hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}