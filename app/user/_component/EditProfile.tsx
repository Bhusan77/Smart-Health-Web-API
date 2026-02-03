/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Controller, useForm } from "react-hook-form";
import { UserEditData, UserEditSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { handleUpdateUser } from "@/lib/actions/auth-action";

export default function EditUserForm() {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserEditData>({
    resolver: zodResolver(UserEditSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void,
  ) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    } else {
      setPreviewImage(null);
    }

    onChange(file);
  };

  const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: UserEditData) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        
        
        if (data.username) {
          formData.append("username", data.username);
        }
        if (data.profile) {
          formData.append("profile", data.profile);
        }
        console.log([...formData.entries()]);

        const response = await handleUpdateUser(formData);

        if (!response.success) {
          throw new Error(response.message || "Update profile failed");
        }
        reset();
        handleDismissImage();
        
      } catch (error: Error | any) {
        
        setError(error.message || "Create profile failed");
      }
    });
  };
  console.log(errors);
   return (
        <div className="max-w-lg rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h1 className="mb-6 text-2xl font-bold text-emerald-700">
                User Profile
            </h1>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {/* Profile Image */}
                <div className="flex items-center gap-4">
                    {previewImage ? (
                        <div className="relative w-24 h-24">
                            <img
                                src={previewImage}
                                alt="Profile Image Preview"
                                className="w-24 h-24 rounded-full object-cover border-2 border-emerald-400"
                            />
                            <Controller
                                name="profile"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <button
                                        type="button"
                                        onClick={() => handleDismissImage(onChange)}
                                        className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                )}
                            />
                        </div>
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                            <span className="text-xs text-emerald-600">No Image</span>
                        </div>
                    )}
                </div>

                {/* Profile Image Input */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-emerald-700">
                        Profile Image
                    </label>
                    <Controller
                        name="profile"
                        control={control}
                        render={({ field: { onChange } }) => (
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                accept=".jpg,.jpeg,.png,.webp"
                                className="block w-full text-sm text-slate-600
                                file:mr-4 file:rounded-md file:border-0
                                file:bg-emerald-100 file:px-4 file:py-2
                                file:text-sm file:font-medium
                                file:text-emerald-700 hover:file:bg-emerald-200"
                            />
                        )}
                    />
                    {errors.profile && <p className="text-xs text-red-600">{errors.profile.message}</p>}
                </div>

                {/* First Name */}
               
                {/* Last Name */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-sky-700">
                        Username
                    </label>
                    <input
                        {...register("username")}
                        className="w-full rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm outline-none focus:border-sky-400"
                    />
                    {errors.username && <p className="text-xs text-red-600">{errors.username.message}</p>}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-md bg-gradient-to-r from-emerald-500 to-sky-500 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
                >
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
}