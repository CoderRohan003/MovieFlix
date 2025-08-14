"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { account } from "@/lib/appwrite";
import { FaEnvelope, FaLock, FaFilm } from "react-icons/fa";

{/* The user login page component */}
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  {/* Handles the user login process */}
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await account.createEmailPasswordSession(email, password);
      router.push("/");
    } catch (err) {
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
        
        <div className="text-center">
            <FaFilm className="mx-auto h-12 w-auto text-blue-500"/>
            <h1 className="mt-4 text-3xl font-bold text-white">
                Sign in to your account
            </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-blue-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}