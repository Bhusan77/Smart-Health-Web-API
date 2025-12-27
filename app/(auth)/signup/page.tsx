// app/auth/signup/page.tsx
"use client";

import SignupForm from "../_components/signupform";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm space-y-6">
        
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Create Account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            SIGN UP TO GET STARTED!!!
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
