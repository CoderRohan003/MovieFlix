import React from 'react';
import Link from 'next/link';
import MovieCard from '@/components/movies/MovieCard';

import {
  fetchTrendingMovies,
  fetchMoviesByLanguage,
  fetchForeignMovies,
  fetchKidsMovies
} from '@/lib/tmdb';

interface MovieSectionProps {
  title: string;
  movies: any[];
  category: string;
}

{/* Displays a row of movies with a title and a "See More" link */}
const MovieSection: React.FC<MovieSectionProps> = ({ title, movies, category }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
        <Link href={`/movies/category/${category}`} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
          See More
        </Link>
      </div>
      <div className="flex overflow-x-auto space-x-4 pb-4 custom-scrollbar">
        {movies.map(movie => (
          <div key={movie.id} className="flex-shrink-0 w-40 sm:w-48 h-60 sm:h-72">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};

{/* Main page to display various categories of movies */}
export default async function MoviesPage() {
  const [
    trendingData,
    hindiData,
    teluguData,
    tamilData,
    bengaliData,
    kannadaData,
    foreignData,
    kidsData
  ] = await Promise.all([
    fetchTrendingMovies(),
    fetchMoviesByLanguage('hi', 'IN'),
    fetchMoviesByLanguage('te', 'IN'),
    fetchMoviesByLanguage('ta', 'IN'),
    fetchMoviesByLanguage('bn', 'IN'),
    fetchMoviesByLanguage('kn', 'IN'),
    fetchForeignMovies(),
    fetchKidsMovies()
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Discover Movies
        </h1>
      </header>

      <main>
        <MovieSection title="Trending This Week" movies={trendingData.results} category="trending" />
        <MovieSection title="Popular in Hindi" movies={hindiData.results} category="hindi" />
        <MovieSection title="Popular in Telugu" movies={teluguData.results} category="telugu" />
        <MovieSection title="Popular in Tamil" movies={tamilData.results} category="tamil" />
        <MovieSection title="Popular in Bengali" movies={bengaliData.results} category="bengali" />
        <MovieSection title="Popular in Kannada" movies={kannadaData.results} category="kannada" />
        <MovieSection title="Popular Foreign Films" movies={foreignData.results} category="foreign" />
        <MovieSection title="Popular Kids Films" movies={kidsData.results} category="kids" />
      </main>
    </div>
  );
}