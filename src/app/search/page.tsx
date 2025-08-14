import MovieCard from '@/components/movies/MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
}

{/* Fetches and sorts movies from the TMDB API */}
async function fetchAndSortMovies(query: string): Promise<Movie[]> {
  if (!query) return [];

  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1&include_adult=false`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results.');
    }

    const data = await response.json();
    const sortedResults = [...data.results].sort((a, b) => {
      if (b.popularity > a.popularity) return 1;
      if (a.popularity > b.popularity) return -1;
      return b.vote_count - a.vote_count;
    });

    return sortedResults;
  } catch (error) {
    console.error(error);
    return [];
  }
}

{/* Displays search results based on the URL query */}
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SearchPage(props: { searchParams?: SearchParams }) {
  const searchParams = (props.searchParams ? await props.searchParams : {}) || {};
  const query = searchParams.q?.toString() || '';
  const movies = await fetchAndSortMovies(query);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8">
          {query ? (
            <h1 className="text-3xl font-bold">
              Search results for: <span className="text-cyan-400">"{query}"</span>
            </h1>
          ) : (
            <h1 className="text-3xl font-bold">Please enter a search term.</h1>
          )}
        </header>

        {movies.length > 0 ? (
          <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <div key={movie.id} className="h-60 sm:h-72">
                <MovieCard movie={movie} />
              </div>
            ))}
          </main>
        ) : (
          query && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No movies found for your search.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}