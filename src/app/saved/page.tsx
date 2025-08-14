"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedMovies, unsaveMovie } from "@/lib/savedMovies";
import { FaTrash, FaRegCompass } from "react-icons/fa";

interface Movie {
  $id: string;
  movieId: string;
  title: string;
  posterPath: string;
}

{/* A loading skeleton for movie cards */}
const MovieCardSkeleton = () => (
  <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
);

{/* A component to show when the watchlist is empty */}
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-16">
    <FaRegCompass size={60} className="mb-4" />
    <h2 className="text-2xl font-bold text-gray-300">Nothing Here Yet</h2>
    <p className="mt-2">Explore and add some movies to your watchlist!</p>
  </div>
);

{/* Renders the user's saved movies watchlist */}
export default function SavedMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  {/* Fetches the list of saved movies on component mount */}
  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        const saved = await getSavedMovies();
        setMovies(
          saved.map((doc: any) => ({
            $id: doc.$id,
            movieId: doc.movieId,
            title: doc.title,
            posterPath: `https://image.tmdb.org/t/p/w500${doc.posterPath}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching saved movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedMovies();
  }, []);

  {/* Removes a movie from the user's watchlist */}
  async function handleRemove(id: string) {
    try {
      const movieToRemove = movies.find(m => m.$id === id);
      if (movieToRemove) {
        await unsaveMovie(Number(movieToRemove.movieId));
        setMovies((prev) => prev.filter((m) => m.$id !== id));
      }
    } catch (error) {
      console.error("Failed to remove movie:", error);
    }
  }
  
  return (
    <div className="p-4 md:p-8 bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          My Watchlist
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie) => (
              <div key={movie.$id} className="group relative rounded-lg overflow-hidden shadow-xl">
                <Link href={`/movies/${movie.movieId}`}>
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg drop-shadow-md">
                    {movie.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleRemove(movie.$id)}
                  className="absolute top-2 right-2 z-10 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                  aria-label={`Remove ${movie.title}`}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}