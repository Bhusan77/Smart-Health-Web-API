"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { loginSchema, type LoginData } from "../schema";
import { handleLogin } from "@/lib/actions/auth-action";

export default function LoginForm() {

  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (values: LoginData) => {
    startTransition(async () => {
    
      const res = await handleLogin(values as LoginData)   
      console.log(res)   
      router.push("/dashboard");
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      autoComplete="off"
    >
     
      <div>
        <input
  {...register("email")}
  type="email"
  autoComplete="new-email"
  placeholder="Email address here"
  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
  text-black placeholder:text-gray-400
  focus:border-blue-500 focus:outline-none"
/>

        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      
      <div>
        <input
  {...register("password")}
  type="password"
  autoComplete="new-password"
  placeholder="Password"
  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
  text-black placeholder:text-gray-400
  focus:border-blue-500 focus:outline-none"
/>

        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          Remember me
        </label>
        <button type="button" className="text-blue-600 hover:underline">
          Forgot password?
        </button>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold
          text-white hover:bg-blue-700 transition disabled:opacity-60"
        >
          {isSubmitting || pending ? "Logging in..." : "Login"}
        </button>

      
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="flex-1 rounded-md border border-blue-600 py-2 text-sm
          font-semibold text-blue-600 hover:bg-blue-50"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
