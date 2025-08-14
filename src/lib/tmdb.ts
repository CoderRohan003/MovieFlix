const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTMDB(endpoint: string, params: string = '') {
  const url = `${BASE_URL}/${endpoint}?api_key=${API_KEY}&${params}`;
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) {
      console.error(`API Error: ${response.statusText} for URL: ${url}`);
      return { results: [] };
    }
    return response.json();
  } catch (error) {
    console.error(`Fetch Error: ${error} for URL: ${url}`);
    return { results: [] };
  }
}

export const fetchTrendingMovies = () => fetchFromTMDB('trending/movie/week');

export const fetchMoviesByLanguage = (lang: string, region: string) =>
  fetchFromTMDB(
    'discover/movie',
    `with_original_language=${lang}&region=${region}&sort_by=popularity.desc&vote_count.gte=100`
  );

export const fetchForeignMovies = () =>
  fetchFromTMDB(
    'discover/movie',
    'with_original_language=ko&sort_by=popularity.desc&vote_count.gte=100'
  );

export const fetchKidsMovies = () =>
  fetchFromTMDB(
    'discover/movie',
    'certification_country=US&certification.lte=G&with_genres=16&include_adult=false&sort_by=popularity.desc'
  );

export async function fetchMovieDetails(id: string) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,images`,
    { next: { revalidate: 86400 } } // cache for 24h
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}


export async function searchMovies(query: string) {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  return res.json();
}
