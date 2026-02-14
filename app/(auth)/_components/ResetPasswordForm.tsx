'use client';
import { useForm } from "react-hook-form";
import { ResetPasswordDTO, ResetPasswordSchema } from "../reset-password/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { handleResetPassword } from "@/lib/actions/auth-action";

export default function ResetPasswordForm({
    token,
}: {
    token: string;
}) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordDTO>({
        resolver: zodResolver(ResetPasswordSchema)
    });
    const router = useRouter();
    const onSubmit = async (data: ResetPasswordDTO) => {
        try {
            const response = await handleResetPassword(token, data.newPassword);
            if (response.success) {
                toast.success("Password reset successfully");
                // Redirect to login page
                router.replace('/login');
            } else {
                toast.error(response.message || "Failed to reset password");
            }
        } catch (error) {
            // Handle error
            toast.error((error as Error).message || "An unexpected error occurred");
        }
    }
    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-3xl font-bold text-center mb-6">Smart Health Care</h1>
            <h2 className="text-center font-bold mb-4">Reset your password</h2>
            <div>
                <label className="label">
                    New Password
                </label>
                <input
                    type="password"
                    {...register("newPassword")}
                    className="input"
                />
                {errors.newPassword && (
                    <p className="error-text">{errors.newPassword.message}</p>
                )}
            </div>
            <div>
                <label className="label">
                    Confirm New Password
                </label>
                <input
                    type="password"
                    {...register("confirmPassword")}
                    className="input"
                />
                {errors.confirmPassword && (
                    <p className="error-text">{errors.confirmPassword.message}</p>
                )}
            </div>
            <div className="flex gap-2 mb-4">
                <Link href="/login" className="text-sm text-[#1EA095] hover:underline">
                    Back to Login
                </Link>
                <Link href="/request-password-reset" className="text-sm text-[#1EA095] hover:underline">
                    Request another reset email
                </Link>
            </div>

            <button
                type="submit"
                className="form-btn"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    )
}