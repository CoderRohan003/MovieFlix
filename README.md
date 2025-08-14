
# 🎬 MovieFlix Web

A **feature-rich movie discovery app** built with **Next.js**, **Appwrite**, and the **TMDB API**.  
Features an **AI chatbot (Google Gemini)**, user profiles, and a personal watchlist.  
This is the **web counterpart** to our React Native mobile app, sharing the same backend for a **unified experience** across platforms.

---

## 🌟 Features

- 🔍 **Discover Movies & TV Shows** — Browse trending, popular, and top-rated titles.
- 🤖 **AI Movie Chatbot** (Google Gemini) — Get intelligent recommendations and hidden gems.
- 👤 **User Profiles** — Manage your account, change profile picture, and personalize experience.
- 🎯 **Personal Watchlist** — Save movies you want to watch later.
- 📱 **Cross-Platform** — Works seamlessly with the MovieFlix mobile app.
- ☁️ **Unified Backend** — Powered by Appwrite for authentication, database, and storage.

---

## 📱 Mobile App Version

Check out the React Native version of MovieFlix here:  
[**MovieFlix Mobile (React Native)**](https://github.com/CoderRohan003/movie-flix.git)

---

## 🚀 Getting Started

Follow these steps to run MovieFlix Web locally for development and testing.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/movieflix-web.git
cd movieflix-web
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_APPWRITE_DATABASE_ID="YOUR_DATABASE_ID"
NEXT_PUBLIC_APPWRITE_USER_PROFILES_COLLECTION_ID="YOUR_USER_PROFILES_COLLECTION_ID"
NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID="YOUR_PROFILES_COLLECTION_ID"
NEXT_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID="YOUR_SAVED_MOVIES_COLLECTION_ID"
NEXT_PUBLIC_APPWRITE_PROFILE_BUCKET_ID="YOUR_PROFILE_PICTURES_BUCKET_ID"

# Third-Party API Keys
NEXT_PUBLIC_TMDB_API_KEY="YOUR_TMDB_API_KEY"
NEXT_PUBLIC_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

You can get these values from your **Appwrite**, **The Movie Database (TMDB)**, and **Google AI Studio** accounts.

---

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Then open:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🛠 Core Technologies

* **Framework:** Next.js (App Router)
* **Backend:** Appwrite (Authentication, Database, Storage)
* **Styling:** Tailwind CSS
* **APIs:**

  * TMDB API — Movie & TV show data
  * Google Gemini API — AI chatbot feature
* **Deployment:** Optimized for Vercel

---

💡 **Tip:** For the best experience, use both the **web** and **mobile** apps — your watchlist and profile will sync automatically across devices.

