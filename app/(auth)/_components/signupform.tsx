"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { registerSchema, type RegisterData } from "../schema";
import { handleRegister } from "@/lib/actions/auth-action";

export default function SignupForm() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (values: RegisterData) => {
    startTransition(async () => {
      const res = await handleRegister(values);

      if (res?.success) {
        setSuccess(true);

        // Redirect to login after 1.5 seconds
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    });
  };

  if (success) {
    return (
      <div className="text-center space-y-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center">
          <span className="text-blue-600 text-xl">✓</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          Account Created!
        </h2>
        <p className="text-sm text-gray-500">
          Redirecting to login page...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Username */}
      <div>
        <label className="text-xs uppercase tracking-wide text-blue-400">
          Username
        </label>
        <input
          {...register("username")}
          type="text"
          placeholder="Type your username"
          className="text-pink-400 w-full border-b border-blue-300 py-2 text-sm
          focus:border-blue-500 focus:outline-none"
        />
        {errors.username && (
          <p className="mt-1 text-xs text-red-500">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="text-xs uppercase tracking-wide text-blue-400">
          E-mail
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="Your email here"
          className="text-pink-400 w-full border-b border-blue-300 py-2 text-sm
          focus:border-blue-500 focus:outline-none"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="relative">
        <label className="text-xs uppercase tracking-wide text-blue-400">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          className="text-pink-400 w-full border-b border-blue-300 py-2 text-sm
          focus:border-blue-500 focus:outline-none"
        />
        {!errors.password && (
          <span className="absolute right-0 top-7 text-green-500 text-sm">
            ✓
          </span>
        )}
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <label className="text-xs uppercase tracking-wide text-blue-400">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="••••••••"
          className="text-pink-400 w-full border-b border-blue-300 py-2 text-sm
          focus:border-blue-500 focus:outline-none"
        />
        {!errors.confirmPassword && (
          <span className="absolute right-0 top-7 text-green-500 text-sm">
            ✓
          </span>
        )}
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2 text-xs text-gray-400">
        <input type="checkbox" className="mt-1" required />
        <p>
          By signing up to our website, you agree to our{" "}
          <span className="text-blue-500 cursor-pointer">
            terms and conditions
          </span>
        </p>
      </div>

      {/* Button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="rounded-full bg-blue-600 px-8 py-2 text-sm font-semibold
          text-white hover:bg-blue-700 transition disabled:opacity-60"
        >
          {isSubmitting || pending ? "Creating..." : "Sign up"}
        </button>

        <span className="text-xs text-gray-400">
          Or{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-500 cursor-pointer"
          >
            Log in here
          </span>
        </span>
      </div>
    </form>
  );
}