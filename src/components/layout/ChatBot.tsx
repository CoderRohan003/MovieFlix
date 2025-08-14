"use client";

import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Film } from 'lucide-react';
import Link from 'next/link';

interface MovieSuggestion {
  title: string;
  year: number;
}

interface MovieDetails extends MovieSuggestion {
  id: number;
  poster_path: string | null;
  vote_average: number;
}

interface Message {
  role: 'user' | 'bot' | 'bot-movies';
  content: string | MovieDetails[];
}

{/* A chatbot component for movie suggestions */}
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hi! How can I help you find a movie today? Try asking for something like 'a funny movie for a rainy day' or 'a good sci-fi film from the 90s'.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  {/* Auto-scroll to the latest message */}
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  {/* Handle the user's message submission */}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const suggestions = await getMovieSuggestionsFromLLM(newMessages);
      
      if (!suggestions || suggestions.length === 0) {
        throw new Error("Couldn't find any movie suggestions for that.");
      }

      const movieDetails = await getMovieDetailsFromTMDB(suggestions);
      
      const botMessage: Message = { role: 'bot-movies', content: movieDetails };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error: any) {
      const errorMessage: Message = { role: 'bot', content: error.message || "Sorry, I couldn't find any suggestions. Please try another query." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-cyan-500 text-white p-4 rounded-full shadow-lg hover:bg-cyan-600 transition-transform hover:scale-110 z-50"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-full max-w-sm h-[70vh] bg-gray-900/80 backdrop-blur-md rounded-lg shadow-2xl flex flex-col z-50 border border-gray-700">
          <header className="bg-gray-800 p-4 text-white font-bold text-lg rounded-t-lg">
            Movie Suggester
          </header>

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-4 ${msg.role.startsWith('bot') ? 'justify-start' : 'justify-end'}`}>
                <div className={`rounded-lg p-3 max-w-xs ${msg.role.startsWith('bot') ? 'bg-gray-700 text-white' : 'bg-cyan-600 text-white'}`}>
                  {typeof msg.content === 'string' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <div className="space-y-3">
                      <p>Here are a few suggestions I found:</p>
                      {msg.content.map(movie => (
                        <MovieSuggestionCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-700 text-white rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Suggest a movie for..."
                className="w-full p-3 pr-12 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={loading}
              />
              <button
                type="submit"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-cyan-400 disabled:text-gray-600"
                disabled={loading}
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

{/* A small card to display a movie suggestion inside the chat window */}
const MovieSuggestionCard = ({ movie }: { movie: MovieDetails }) => (
  <Link href={`/movies/${movie.id}`} className="flex items-center gap-3 bg-gray-800 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
    <img
      src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://placehold.co/92x138/1f2937/4b5563?text=N/A'}
      alt={movie.title}
      className="w-12 h-auto rounded-md"
    />
    <div className="flex-1 min-w-0">
      <p className="font-bold truncate">{movie.title}</p>
      <p className="text-sm text-gray-400">{movie.year}</p>
    </div>
  </Link>
);

{/* Gets structured movie suggestions from the Gemini API */}
async function getMovieSuggestionsFromLLM(chatHistory: Message[]): Promise<MovieSuggestion[]> {
  const systemPrompt = `You are a friendly and helpful movie suggestion chatbot. Based on the user's request and the conversation history, suggest 3 movies. Prioritize Hindi movies unless another language is specified. If no good Hindi matches are found, you can suggest popular English-language movies. Today's date is August 14, 2025. The user is in India. For follow-up questions like "suggest more", provide 3 *different* movies based on the original request's context. Only return a JSON array of objects, where each object has "title" (string) and "year" (number) properties.`;

  const contents = chatHistory.map(message => {
    if (message.role === 'bot-movies') {
      const movieTitles = (message.content as MovieDetails[]).map(m => `${m.title} (${m.year})`).join(', ');
      return {
        role: 'model',
        parts: [{ text: `I suggested these movies: ${movieTitles}` }],
      };
    }
    return {
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content as string }],
    };
  });

  const payload = {
    contents: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: "Okay, I'm ready. How can I help?" }] },
      ...contents
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            year: { type: "NUMBER" },
          },
          required: ["title", "year"],
        },
      },
    },
  };

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to get suggestions from the AI.');
  }

  const result = await response.json();
  if (!result.candidates || result.candidates.length === 0) {
      throw new Error("I couldn't generate a response for that. Please try a different query.");
  }
  const text = result.candidates[0].content.parts[0].text;
  return JSON.parse(text);
}

{/* Fetches full movie details from TMDB for each suggestion */}
async function getMovieDetailsFromTMDB(suggestions: MovieSuggestion[]): Promise<MovieDetails[]> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  const moviePromises = suggestions.map(async (suggestion) => {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(suggestion.title)}&primary_release_year=${suggestion.year}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    const movie = data.results[0];
    
    if (movie) {
      return {
        ...suggestion,
        id: movie.id,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
      };
    }
    return null;
  });

  const movies = await Promise.all(moviePromises);
  return movies.filter((movie): movie is MovieDetails => movie !== null);
}