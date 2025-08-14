import { account, databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!;

{/* Saves a movie to the user's watchlist */}
export async function saveMovie(movie: {
  movieId: number;
  title: string;
  posterPath?: string; 
  releaseDate: string;
  voteAverage: number;
  genres: { name: string }[]; 
}) {
  try {
    const user = await account.get();
    const genresAsString = movie.genres.map((g) => g.name).join(", ");

    const documentToCreate = {
      userId: user.$id,
      movieId: String(movie.movieId),
      title: movie.title,
      posterPath: movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
        : "/no-poster.jpg",
      releaseDate: movie.releaseDate,
      voteAverage: movie.voteAverage,
      genres: genresAsString,
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      documentToCreate
    );
    return response;
  } catch (error) {
    console.error("❌ Error saving movie:", error);
    throw new Error("Failed to save movie.");
  }
}

{/* Removes a movie from the user's watchlist */}
export async function unsaveMovie(movieId: number) {
  try {
    const user = await account.get();
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", user.$id),
      Query.equal("movieId", String(movieId)),
    ]);

    if (response.documents.length > 0) {
      const documentId = response.documents[0].$id;
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
    } else {
      console.warn(`🤔 No movie found with ID ${movieId} for this user to delete.`);
    }
  } catch (error) {
    console.error("❌ Error unsaving movie:", error);
    throw new Error("Failed to unsave movie.");
  }
}

{/* Checks if a movie is already in the user's watchlist */}
export async function isMovieSaved(movieId: number) {
  try {
    const user = await account.get();
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", user.$id),
      Query.equal("movieId", String(movieId)),
      Query.limit(1),
    ]);

    const isSaved = response.total > 0;
    return isSaved;
  } catch (error) {
    console.error("❌ Error checking if movie is saved:", error);
    return false;
  }
}

{/* Retrieves all movies from the user's watchlist */}
export async function getSavedMovies() {
  try {
    const user = await account.get();
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", user.$id),
      Query.orderDesc("$createdAt"),
    ]);

    return response.documents;
  } catch (error) {
    console.error("❌ Error getting saved movies:", error);
    return [];
  }
}