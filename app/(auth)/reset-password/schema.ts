import z from "zod";

export const ResetPasswordSchema = z.object({
   newPassword: z.string().min(6, "Password must be at least 6 characters long"),
   confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords do not match!"
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;