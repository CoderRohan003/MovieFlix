"use client";

import { useState, useEffect } from "react";
import { saveMovie, unsaveMovie, isMovieSaved } from "@/lib/savedMovies";
import { fetchMovieDetails } from "@/lib/tmdb";
import { use } from "react";
import { FaBookmark, FaRegBookmark, FaStar, FaPlay } from "react-icons/fa";

{/* Skeleton UI for the movie detail page */ }
const MovieDetailSkeleton = () => (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-[300px] h-[450px] bg-gray-700 rounded-lg"></div>
            <div className="flex-1">
                <div className="h-10 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
                <div className="h-12 bg-gray-700 rounded w-48"></div>
            </div>
        </div>
    </div>
);

{/* Fetches and displays the details for a single movie */ }
export default function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [movie, setMovie] = useState<any>(null);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    {/* Load movie details and saved status */ }
    useEffect(() => {
        const loadMovie = async () => {
            try {
                const details = await fetchMovieDetails(slug);
                setMovie(details);
                const status = await isMovieSaved(details.id);
                setSaved(status);
            } catch (error) {
                console.error("❌ Error loading movie:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMovie();
    }, [slug]);

    {/* Save or unsave the movie */ }
    const toggleSave = async () => {
        try {
            if (saved) {
                await unsaveMovie(movie.id);
                setSaved(false);
            } else {
                await saveMovie({
                    movieId: movie.id,
                    title: movie.title,
                    posterPath: movie.poster_path,
                    releaseDate: movie.release_date,
                    voteAverage: movie.vote_average,
                    genres: movie.genres?.map((g: any) => g.name) || [],
                });
                setSaved(true);
            }
        } catch (error) {
            console.error("❌ Error saving/removing movie:", error);
        }
    };

    if (loading) {
        return <MovieDetailSkeleton />;
    }

    if (!movie) {
        return <div className="text-center text-white mt-10">Movie not found.</div>;
    }

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : "/placeholder-backdrop.jpg";
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/placeholder-poster.jpg";

    const trailer = movie.videos?.results?.find(
        (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
    );

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div
                className="relative h-[50vh] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${backdropUrl})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 pb-16 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3">
                        <img
                            src={posterUrl}
                            alt={`Poster for ${movie.title}`}
                            className="w-full h-auto rounded-lg shadow-2xl"
                        />
                    </div>

                    <div className="w-full md:w-2/3 mt-8 md:mt-0">
                        <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>
                        <p className="text-lg text-gray-400 mt-2">{movie.tagline}</p>

                        <div className="flex items-center gap-6 mt-4 text-gray-300">
                            <div className="flex items-center gap-2">
                                <FaStar className="text-yellow-400" />
                                <span>{movie.vote_average?.toFixed(1)} / 10</span>
                            </div>
                            <span>{movie.release_date?.split('-')[0]}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {movie.genres?.map((genre: any) => (
                                <span key={genre.id} className="px-3 py-1 bg-gray-700 text-sm rounded-full">
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <button
                                onClick={toggleSave}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105 
                                ${saved
                                        ? "bg-amber-600 hover:bg-amber-700"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {saved ? <FaBookmark /> : <FaRegBookmark />}
                                {saved ? "Saved" : "Save"}
                            </button>
                            {trailer && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-white/50 hover:bg-white/10 rounded-lg font-semibold"
                                >
                                    <FaPlay />
                                    Watch Trailer
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}