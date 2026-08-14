import { useEffect, useState } from "react";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(true);
  const API_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;

  const featuredMovie = movies[0] || null;

  const themeClasses = isDark
    ? {
      shell: "min-h-screen bg-[#0b0b0b] text-white",
      nav: "border-white/10 bg-white/5",
      navText: "text-zinc-200",
      buttonSecondary: "bg-white/5 text-zinc-200 hover:bg-white/10",
      input: "border-white/10 bg-[#111111] text-white placeholder:text-zinc-400",
      chip: "bg-white/5 text-zinc-200 hover:bg-white/10",
      hero: "bg-gradient-to-r from-black via-[#1a1a1a] to-red-900",
      card: "border-white/10 bg-[#171717] hover:border-red-500/40",
      muted: "text-zinc-400",
      body: "text-zinc-300",
    }
    : {
      shell: "min-h-screen bg-[#f5f5f1] text-slate-900",
      nav: "border-black/10 bg-white/80 shadow-lg",
      navText: "text-slate-700",
      buttonSecondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
      input: "border-black/10 bg-slate-100 text-slate-900 placeholder:text-slate-500",
      chip: "bg-slate-200 text-slate-800 hover:bg-slate-300",
      hero: "bg-gradient-to-r from-[#f7f7f7] via-[#ffe1e1] to-[#f4d5d5]",
      card: "border-black/10 bg-white hover:border-red-300",
      muted: "text-slate-500",
      body: "text-slate-700",
    };

  const fetchMovies = async (term = "") => {
    if (!API_TOKEN) {
      setError("Missing TMDB bearer token. Set VITE_TMDB_BEARER_TOKEN in your root .env file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = term.trim()
        ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(term)}&page=1&language=en-US`
        : "https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=1";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok (${response.status}): ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      setError(`Failed to fetch movies. ${message}`);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [API_TOKEN]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchMovies(searchTerm);
  };

  const movieRows = [
    { id: "trending", title: "Trending Now", items: movies.slice(0, 8) },
    { id: "continue", title: "Continue Watching", items: movies.slice(1, 9) },
    { id: "top-rated", title: "Top Rated", items: movies.slice(2, 10) },
  ];

  return (
    <div className={`${themeClasses.shell} transition-colors duration-300`}>
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div id="top" />
        <header className={`mb-8 rounded-full border px-4 py-3 backdrop-blur-sm ${themeClasses.nav}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-lg font-black text-white">
                N
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-500">Netflix</p>
                <h1 className={`text-xl font-bold ${themeClasses.navText}`}>MiniFlix</h1>
              </div>
            </div>

            <nav className={`flex flex-wrap items-center gap-2 text-sm ${themeClasses.navText}`}>
              <a href="#trending" className="rounded-full bg-red-600 px-3 py-1.5 font-medium text-white no-underline">Trending</a>
              <a href="#popular" className={`rounded-full px-3 py-1.5 transition no-underline ${themeClasses.buttonSecondary}`}>Popular</a>
              <a href="#new" className={`rounded-full px-3 py-1.5 transition no-underline ${themeClasses.buttonSecondary}`}>New</a>
              <a href="#my-list" className={`rounded-full px-3 py-1.5 transition no-underline ${themeClasses.buttonSecondary}`}>My List</a>
            </nav>

            <div className="flex w-full max-w-md items-center gap-2">
              <form onSubmit={handleSubmit} className="w-full">
                <label className="sr-only" htmlFor="movie-search">Search movies</label>
                <input
                  id="movie-search"
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search for a movie"
                  className={`w-full rounded-full border px-4 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 ${themeClasses.input}`}
                />
              </form>

              <button
                type="button"
                onClick={() => setIsDark((current) => !current)}
                aria-label="Toggle color mode"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-lg text-white shadow-lg shadow-red-600/30 transition hover:scale-105"
              >
                {isDark ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </header>

        {featuredMovie && (
          <section
            id="trending"
            className={`relative mb-8 overflow-hidden rounded-[2rem] border ${themeClasses.hero} border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.30)]`}
            style={{
              backgroundImage: featuredMovie.backdrop_path
                ? `linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(15,23,42,0.82) 30%, rgba(15,23,42,0.28) 100%), url(${TMDB_IMAGE_BASE}${featuredMovie.backdrop_path})`
                : "linear-gradient(135deg, #111827 0%, #7f1d1d 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="grid min-h-[440px] items-end gap-6 p-6 md:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
              <div className="max-w-xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-300">Featured today</p>
                <h2 className="text-3xl font-black text-white md:text-5xl">{featuredMovie.title}</h2>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-200">
                  <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1">
                    {featuredMovie.release_date ? featuredMovie.release_date.slice(0, 4) : "New"}
                  </span>
                  <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2.5 py-1 text-yellow-300">
                    ★ {featuredMovie.vote_average?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-zinc-300">{featuredMovie.vote_count || 0} votes</span>
                </div>
                <p className="mt-5 max-w-lg text-base leading-7 text-zinc-200 md:text-lg">
                  {featuredMovie.overview || "No overview available."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#trailer" className="rounded-full bg-red-600 px-5 py-3 font-medium text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 no-underline">
                    Watch trailer
                  </a>
                  <a href="#details" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10 no-underline">
                    More info
                  </a>
                </div>
              </div>

              <div className="justify-self-end">
                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 shadow-2xl backdrop-blur-sm">
                  <img
                    src={
                      featuredMovie.poster_path
                        ? `${TMDB_IMAGE_BASE}${featuredMovie.poster_path}`
                        : "https://placehold.co/500x750/111827/94a3b8?text=Movie"
                    }
                    alt={featuredMovie.title}
                    className="h-[320px] w-full object-cover sm:h-[400px]"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="popular" className="mb-4 flex flex-wrap gap-2">
          {[
            "All",
            "Action",
            "Comedy",
            "Drama",
            "Adventure",
            "Thriller",
            "Sci-Fi",
          ].map((category, index) => (
            <a
              key={category}
              href="#"
              className={`rounded-full px-4 py-2 text-sm font-medium transition no-underline ${index === 0
                ? "bg-red-600 text-white"
                : themeClasses.chip
                }`}
            >
              {category}
            </a>
          ))}
        </section>

        {loading && <p className={`py-6 text-center ${themeClasses.muted}`}>Loading movies...</p>}
        {error && <p className="py-6 text-center text-red-500">{error}</p>}

        {!loading && !error && movies.length === 0 && (
          <p className={`py-8 text-center ${themeClasses.muted}`}>No movies found.</p>
        )}

        {!loading && !error && movies.length > 0 && (
          <>
            {movieRows.map((row) => (
              <section key={row.id} id={row.id === "continue" ? "continue" : row.id} className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{row.title}</h3>
                  <a href="#top" className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"} no-underline`}>
                    {row.id === "trending" ? "Explore all" : row.id === "continue" ? "View all" : "Back to top"}
                  </a>
                </div>

                <div className="scrollbar-hidden flex gap-4 overflow-x-auto pb-4">
                  {row.items.map((movie) => (
                    <article
                      key={`${row.id}-${movie.id}`}
                      className={`group min-w-[180px] max-w-[180px] overflow-hidden rounded-[1.25rem] border shadow-lg transition duration-300 hover:-translate-y-1 hover:border-red-500/40 ${themeClasses.card}`}
                    >
                      <div className="relative">
                        <img
                          src={
                            movie.poster_path
                              ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                              : "https://placehold.co/500x750/0f172a/94a3b8?text=Poster"
                          }
                          alt={movie.title}
                          className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        {row.id === "continue" ? (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-3">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                              <div className="h-full w-2/3 rounded-full bg-red-500" />
                            </div>
                          </div>
                        ) : (
                          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-yellow-300">
                            ★ {movie.vote_average?.toFixed(1) || "N/A"}
                          </span>
                        )}
                      </div>

                      <div className="p-3">
                        <h4 className={`truncate text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                          {movie.title}
                        </h4>
                        <p className={`mt-1 text-xs ${themeClasses.muted}`}>
                          {row.id === "continue"
                            ? "Episode 3"
                            : row.id === "top-rated"
                              ? `${movie.vote_count || 0} ratings`
                              : movie.release_date
                                ? movie.release_date.slice(0, 4)
                                : "N/A"}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}

        <div id="details" className={`mt-10 rounded-[1.5rem] border p-6 text-sm ${isDark ? "border-white/10 bg-white/5 text-zinc-300" : "border-slate-200 bg-slate-100 text-slate-700"}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">Details</p>
          <h3 className={`mt-2 text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Your movie picks</h3>
          <p className={`mt-2 max-w-2xl ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
            Browse trending releases, discover popular titles, and explore new films from your curated movie list.
          </p>
        </div>

        <div id="my-list" className={`mt-6 text-center text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Saved to your list • Updated daily
        </div>
      </div>
    </div>
  );
}

export default App;
