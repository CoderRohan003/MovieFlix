"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, X } from 'lucide-react';

interface MovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

{/* A search bar with a debounced dropdown for live results */ }
export default function NavbarSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);

  {/* Debounce API calls to prevent firing on every keystroke */ }
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const debounceTimer = setTimeout(() => {
      const fetchMovies = async () => {
        try {
          const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch search results.');
          }
          const data = await response.json();
          setResults(data.results.slice(0, 5));
        } catch (error) {
          console.error(error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      fetchMovies();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  {/* Close the dropdown when clicking outside the component */ }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  {/* Clear the search input and results */ }
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  {/* Navigate to the full search page on Enter */ }
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    handleClear();
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs" ref={searchRef}>
      <div className="relative">
        <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for a movie..."
          className="w-full p-2 pl-10 pr-8 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
        />
        {query && (
          <button type="button" onClick={handleClear} className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {isFocused && (query.trim().length > 0 || loading) && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-4 text-center text-gray-400">Searching...</div>
          ) : results.length > 0 ? (
            <>
              <ul>
                {results.map((movie) => (
                  <li key={movie.id}>
                    <Link
                      href={`/movies/${movie.id}`}
                      onClick={handleClear}
                      className="flex items-center p-3 gap-4 hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                            : 'https://placehold.co/92x138/1f2937/4b5563?text=N/A'
                        }
                        alt={movie.title}
                        className="w-12 h-auto rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{movie.title}</p>
                        <p className="text-sm text-gray-400">{movie.release_date?.split('-')[0] || 'Unknown'}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={handleClear}
                className="block w-full text-center p-3 font-semibold text-cyan-400 bg-gray-900/50 hover:bg-gray-700 transition-colors"
              >
                View all results
              </Link>
            </>
          ) : (
            !loading && <div className="p-4 text-center text-gray-400">No results found for "{query}"</div>
          )}
        </div>
      )}
    </form>
  );
}