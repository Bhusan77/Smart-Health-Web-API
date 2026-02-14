import z from "zod";

export const RequestPasswordResetSchema = z.object({
    email: z.email()
});

export type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetSchema>;