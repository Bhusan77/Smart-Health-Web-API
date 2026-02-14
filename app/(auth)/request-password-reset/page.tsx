"use client";
import { useForm } from "react-hook-form";
import { RequestPasswordResetDTO, RequestPasswordResetSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@/lib/api/auth";
import { toast } from "react-toastify";


export default function Page() {
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<RequestPasswordResetDTO>({
        resolver: zodResolver(RequestPasswordResetSchema)
    });

    const onSubmit = async (data: RequestPasswordResetDTO )=> {
        try{
            const response = await requestPasswordReset(data.email);
            if (response.success) {
                toast.success('Password reset link sent to your email.');
            }else{
                toast.error(response.message || 'Failed to request password reset.');
            }
        }catch(error){
            toast.error((error as Error).message || 'Failed to request password reset.');
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-3xl font-bold text-center mb-6">Smart Health Care</h1>
            <h2 className="text-center font-bold mb-4">Request Password Reset</h2>
            
            <div>
                <label className="label">Email</label>
                <input className="input" {...register("email")}/>
                <p className="error-text">{errors.email?.message}</p>
            </div>
            <div>
                <button className="form-btn" type="submit" disabled={isSubmitting}>Send Reset Link</button>
            </div>
        </form>
    );
}