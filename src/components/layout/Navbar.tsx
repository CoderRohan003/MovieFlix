"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";
import { Models } from "appwrite";
import { FaUserCircle } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import NavbarSearch from "./NavbarSearch";

{/* The main navigation bar for the site */}
export default function Navbar() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  {/* Check if a user is currently logged in */}
  const fetchUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  };

  {/* Fetch user on initial load and close mobile menu on navigation */}
  useEffect(() => {
    fetchUser();
    setIsMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  {/* Log the user out and redirect to the login page */}
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 text-white backdrop-blur-md border-b border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition-colors"
            >
              MovieFlix
            </Link>
            <div className="hidden md:flex items-baseline space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-xl font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="px-3 py-2 rounded-md text-xl font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Movies
              </Link>
              {user && (
                <Link
                  href="/saved"
                  className="px-3 py-2 rounded-md text-xl font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Watchlist
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:block">
              <NavbarSearch />
            </div>

            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-700"
                  >
                    <FaUserCircle size={24} />
                    <span className="hidden sm:inline text-xl font-medium">
                      {user.name}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-xl font-medium text-gray-300 hover:bg-red-600 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-md text-xl font-medium text-white hover:bg-gray-700 hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 rounded-md text-xl font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/movies"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Movies
            </Link>
            {user && (
              <Link
                href="/saved"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Watchlist
              </Link>
            )}
             <div className="px-2 pt-4 pb-2">
               <NavbarSearch />
             </div>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {user ? (
              <div className="px-2 space-y-1">
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-red-600 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}