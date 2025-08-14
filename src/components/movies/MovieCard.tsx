"use client";

  import Link from "next/link";
  import { Star } from "lucide-react";

  {/* A component that displays a star partially filled based on a rating */}
  const StarRating = ({ rating }: { rating: number }) => {
    var fillPercentage = (rating - 1) / 10 * 100;
    if (rating < 1 || rating > 10) {
      fillPercentage = 0;
    }

    return (
      <div className="relative flex items-center">
        <Star className="w-3.5 h-3.5 text-white" fill="currentColor" />
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <Star className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
        </div>
      </div>
    );
  };

  {/* Formats a date string into DD/MM/YY format */}
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(date);
    } catch (error) {
      return "N/A";
    }
  };

  {/* A reusable card component to display a movie poster and basic info */}
  export default function MovieCard({ movie }: { movie: any }) {
    const title = movie.title || movie.name;
    const needsMarquee = title.length > 20;

    return (
      <Link
        href={`/movies/${movie.id}`}
        className="group relative block h-full w-full bg-black rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-cyan-500/20"
      >
        <div className="relative h-full w-full">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://placehold.co/500x750/111827/4b5563?text=Poster+Not+Found"
            }
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = "https://placehold.co/500x750/111827/4b5563?text=Poster+Not+Found";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <div className="relative w-full overflow-hidden h-6 mb-1">
            {needsMarquee ? (
              <div className="title-marquee absolute top-0 left-0 flex w-max">
                <h3 className="text-md font-bold whitespace-nowrap pr-8">{title}</h3>
              </div>
            ) : (
              <h3 className="text-md font-bold truncate">{title}</h3>
            )}
          </div>

          <div className="flex justify-between items-center text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <StarRating rating={movie.vote_average || 0} />
              <span className="font-semibold tracking-wider">{(movie?.vote_average ?? 0).toFixed(1)}</span>
            </div>
            <span className="font-mono">{formatDate(movie.release_date || movie.first_air_date)}</span>
          </div>
        </div>
        
    
      </Link>
    );
  }