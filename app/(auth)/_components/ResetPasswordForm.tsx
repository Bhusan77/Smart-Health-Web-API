"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ResetPasswordDTO, ResetPasswordSchema } from "../reset-password/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { handleResetPassword } from "@/lib/actions/auth-action";

export default function ResetPasswordForm() {
  const router = useRouter();
  const sp = useSearchParams();

  const token = sp.get("token") || ""; // ✅ always reads from URL

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordDTO>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: ResetPasswordDTO) => {
    if (!token) {
      toast.error("Reset token missing. Please open the link from your email again.");
      return;
    }

    try {
      setLoading(true);

      const response = await handleResetPassword(token, data.newPassword);

      if (response?.success) {
        toast.success("Password reset successfully");
        router.replace("/login");
      } else {
        toast.error(response?.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl font-bold text-center mb-6">Smart Health Care</h1>
      <h2 className="text-center font-bold mb-4">Reset your password</h2>

      {!token && (
        <p className="error-text" style={{ marginBottom: 12 }}>
          Token missing. Please open the reset link again.
        </p>
      )}

      <div>
        <label className="label">New Password</label>
        <input type="password" {...register("newPassword")} className="input" />
        {errors.newPassword && <p className="error-text">{errors.newPassword.message}</p>}
      </div>

      <div>
        <label className="label">Confirm New Password</label>
        <input type="password" {...register("confirmPassword")} className="input" />
        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
      </div>

      <div className="flex gap-2 mb-4">
        <Link href="/login" className="text-sm text-[#1EA095] hover:underline">
          Back to Login
        </Link>
        <Link href="/request-password-reset" className="text-sm text-[#1EA095] hover:underline">
          Request another reset email
        </Link>
      </div>

      <button type="submit" className="form-btn" disabled={loading || !token}>
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}