"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="mb-6 text-gray-600">Welcome to your dashboard!</p>
        <button
          onClick={handleLogout}
          className="rounded-full bg-red-600 px-6 py-2 text-white font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
