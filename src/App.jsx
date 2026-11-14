
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar-temp.jsx";
import NewsCard from "./components/NewsCard.jsx";

function App() {
  const [activeCategory, setActiveCategory] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          category: activeCategory,
          q: searchTerm.trim(),
        });

        // Request news from our own backend
        const response = await fetch(
          `http://localhost:5000/api/news?${params}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch news.");
        }

        // Convert API data into the format used by NewsCard
        const formattedArticles = (data.articles || []).map(
          (article, index) => ({
            id: article.url || index,
            category:
              activeCategory === "Home" ? "World" : activeCategory,
            title: article.title || "Untitled article",
            description:
              article.description || "No description available.",
            date: article.publishedAt
              ? new Date(article.publishedAt).toLocaleString("en-IN")
              : "Date unavailable",
            image: article.image || "",
            url: article.url || "#",
          })
        );

        setArticles(formattedArticles);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
          setArticles([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [activeCategory, searchTerm]);

  return (
    <div>
      <Navbar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />

      <main className="homepage">
        <section className="hero">
          <div>
            <span className="hero-label">
              YOUR DAILY NEWS SOURCE
            </span>

            <h1>
              Stay Informed.<br />
              Stay Ahead.
            </h1>

            <p>
              Discover the latest stories, important updates and
              global developments, all in one place.
            </p>
          </div>
        </section>

        <section className="news-section">
          <div className="section-heading">
            <div>
              <span className="section-label">
                LATEST UPDATES
              </span>

              <h2>
                {activeCategory === "Home"
                  ? "Latest Headlines"
                  : activeCategory + " News"}
              </h2>
            </div>

            <span className="article-count">
              {articles.length} Articles
            </span>
          </div>

          {loading && (
            <div className="status-message">
              Loading latest news...
            </div>
          )}

          {!loading && error && (
            <div className="error-message">
              <h3>Unable to load news</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <div className="news-grid">
              {articles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="no-results">
              <h3>No articles found</h3>
              <p>
                Try another search or select a different category.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("Home");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <h2>
          GLOBAL<span>NEWS</span>
        </h2>

        <p>Your daily source for global news and updates.</p>
        <p>© 2026 Global News. Demo project.</p>
      </footer>
    </div>
  );
}

export default App;
