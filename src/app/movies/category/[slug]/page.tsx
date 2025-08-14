import MovieCard from '@/components/movies/MovieCard';
import { use } from 'react';
import {
  fetchTrendingMovies,
  fetchMoviesByLanguage,
  fetchForeignMovies,
  fetchKidsMovies
} from '@/lib/tmdb';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  name?: string;
  first_air_date?: string;
}

const categoryTitles: { [key: string]: string } = {
  trending: 'Trending Movies',
  hindi: 'Popular Hindi Movies',
  telugu: 'Popular Telugu Movies',
  tamil: 'Popular Tamil Movies',
  bengali: 'Popular Bengali Movies',
  kannada: 'Popular Kannada Movies',
  foreign: 'Popular Foreign Films',
  kids: 'Popular Kids Films',
};

{/* Fetches data based on the category slug */}
async function getCategoryData(slug: string): Promise<{ results: Movie[] }> {
  switch (slug) {
    case 'trending':
      return fetchTrendingMovies();
    case 'hindi':
      return fetchMoviesByLanguage('hi', 'IN');
    case 'telugu':
      return fetchMoviesByLanguage('te', 'IN');
    case 'tamil':
      return fetchMoviesByLanguage('ta', 'IN');
    case 'bengali':
      return fetchMoviesByLanguage('bn', 'IN');
    case 'kannada':
      return fetchMoviesByLanguage('kn', 'IN');
    case 'foreign':
      return fetchForeignMovies();
    case 'kids':
      return fetchKidsMovies();
    default:
      return { results: [] };
  }
}

{/* Renders a grid of movies for a selected category */}
type Params = Promise<{ slug: string }>;

export default async function CategoryPage(props: { params: Params }) {
  const { slug } = await props.params;
  const data = await getCategoryData(slug);
  const movies = data.results || [];
  const title = categoryTitles[slug] || 'Movies';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
        </header>

        {movies.length > 0 ? (
          <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie: Movie) => (
              <div key={movie.id} className="h-60 sm:h-72">
                <MovieCard movie={movie} />
              </div>
            ))}
          </main>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No movies found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}