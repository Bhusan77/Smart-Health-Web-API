"use client";

import LoginForm from "../_components/loginform";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-400 p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        
        <div className="hidden md:flex flex-col justify-center px-10 text-white bg-gradient-to-br from-blue-600 to-blue-500">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Hello,<br />welcome!
            </h1>

            <p className="text-sm text-white/90 max-w-sm">
              Smart Care, Better Living!
            </p>
          </div>
        </div>

        
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-700">
                Welcome back
              </h2>
              <p className="text-sm text-gray-500">
                Log in to your account
              </p>
            </div>

            <LoginForm />

            
            <div className="text-center text-xs text-gray-400">
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
