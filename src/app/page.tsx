"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await account.get();
        if (!mounted) return;
        router.replace("/movies");
      } catch (err) {
        if (!mounted) return;
        router.replace("/auth/login");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-950 text-white min-h-[calc(100vh-4rem)]">
      <div className="w-16 h-16 border-4 border-t-cyan-500 border-gray-800 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-400">Authenticating...</p>
    </div>
  );
}
