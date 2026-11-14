
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const categoryMap = {
    Home: "general",
    World: "world",
    Business: "business",
    Technology: "technology",
    Sports: "sports",
    Health: "health",
};

app.get("/", (req, res) => {
    res.send("Global News API is running!");
});

app.get("/api/news", async (req, res) => {
    try {
        const category = req.query.category || "Home";
        const searchTerm = req.query.q || "";
        const apiKey = process.env.GNEWS_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                message: "GNews API key is missing.",
            });
        }

        const params = new URLSearchParams({
            category: categoryMap[category] || "general",
            country: "in",
            lang: "en",
            max: "10",
            apikey: apiKey,
        });

        if (searchTerm.trim()) {
            params.set("q", searchTerm.trim());
        }

        const response = await fetch(
            `https://gnews.io/api/v4/top-headlines?${params}`
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: "GNews request failed. Please check your API key or quota.",
            });
        }

        res.json(data);
    } catch (error) {
        console.error("News API error:", error.message);

        res.status(500).json({
            message: "Unable to fetch news. Please try again.",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
