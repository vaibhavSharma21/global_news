
function NewsCard({ article }) {
    return (
        <article className="news-card">
            <div className="news-image">
                <img src={article.image} alt={article.title} />
                <span className="news-category">{article.category}</span>
            </div>

            <div className="news-card-content">
                <span className="news-date">{article.date}</span>

                <h3>{article.title}</h3>

                <p>{article.description}</p>

                <a href={article.url} target="_blank" rel="noreferrer">
                    Read More <span>→</span>
                </a>
            </div>
        </article>
    );
}

export default NewsCard;
