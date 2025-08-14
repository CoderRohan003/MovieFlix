"use client";

import { useEffect, useState } from "react";
import { Clock, Film, Heart } from "lucide-react";
import MovieCard from "@/components/movies/MovieCard";
import { account, databases } from "@/lib/appwrite";
import { Query } from "appwrite";

const favoriteMovies = [
    {
        id: 569094,
        title: "Interstellar",
        poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        release_date: "2014-11-14",
        vote_average: 8.3,
    },
    {
        id: 693134,
        title: "War 2",
        poster_path: "/kD0TOH6EM1q7UfgugBXuMoZd3m5.jpg",
        release_date: "2021-09-15",
        vote_average: 7.8,
    },
    {
        id: 1234821,
        title: "Jurassic World Rebirth",
        poster_path: "/1RICxzeoNCAO5NpcRMIgg1XT6fm.jpg",
        release_date: "2025-07-01",
        vote_average: 7.8,
    },
];

{/* A card to display a single user statistic */}
const StatCard = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) => (
    <div className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-4">
        <div className="text-cyan-400">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-lg font-bold text-white">{value}</p>
        </div>
    </div>
);

{/* Renders the user's profile page */}
export default function ProfilePage() {
    const [userProfile, setUserProfile] = useState<any>(null);

    {/* Fetches the user's profile data from Appwrite */}
    useEffect(() => {
        async function fetchProfile() {
            try {
                const user = await account.get();
                const [userProfileResponse, profileResponse] = await Promise.all([
                    databases.listDocuments(
                        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                        process.env.NEXT_PUBLIC_APPWRITE_USER_PROFILES_COLLECTION_ID!,
                        [Query.equal("userId", user.$id)]
                    ),
                    databases.listDocuments(
                        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                        process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID!,
                        [Query.equal("userId", user.$id)]
                    ),
                ]);

                const userProfileDoc = userProfileResponse.documents[0];
                const profileDoc = profileResponse.documents[0];

                if (!userProfileDoc || !profileDoc) {
                    throw new Error("User profile not found in database.");
                }

                setUserProfile({
                    name: profileDoc.fullName,
                    avatarUrl: userProfileDoc.profileImageUrl,
                    phone: profileDoc.phone,
                    joinDate: user.$createdAt,
                    favoriteGenre: profileDoc.favoriteGenre || "Not set",
                });
            } catch (error: any) {
                console.error(
                    "Failed to fetch user profile:",
                    error.message || error,
                    error.response || ""
                );
            }
        }

        fetchProfile();
    }, []);

    if (!userProfile) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p>Loading profile...</p>
            </div>
        );
    }

    const joinDateFormatted = new Date(userProfile.joinDate).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <header className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="relative">
                        <img
                            src={
                                userProfile.avatarUrl ||
                                "https://i.pravatar.cc/150?u=default"
                            }
                            alt="User Avatar"
                            className="w-32 h-32 rounded-full border-4 border-cyan-500 shadow-lg object-cover"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold">{userProfile.name}</h1>
                        <p className="text-gray-400 mt-1">
                            Member since {joinDateFormatted}
                            <br />
                            Phone: {userProfile.phone}
                        </p>
                    </div>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <aside className="lg:col-span-1">
                        <h2 className="text-2xl font-bold mb-6">Statistics</h2>
                        <div className="space-y-4">
                            <StatCard
                                icon={<Heart size={24} />}
                                label="Favorite Genre"
                                value={userProfile.favoriteGenre}
                            />
                        </div>
                    </aside>
                    <main className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-6">Favorites</h2>
                        {favoriteMovies.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {favoriteMovies.map((movie) => (
                                    <div key={movie.id} className="h-60 sm:h-72">
                                        <MovieCard movie={movie} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-lg">
                                <p className="text-gray-400">No favorite movies yet.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}