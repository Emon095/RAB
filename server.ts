import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route to fetch CTFtime stats (Server-side to avoid CORS)
  app.get("/api/team-stats/:id", async (req, res) => {
    try {
      const teamId = req.params.id;
      // We set a User-Agent because CTFtime might block empty ones
      const response = await fetch(`https://ctftime.org/api/v1/teams/${teamId}/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`CTFtime API responded with ${response.status}`);
      }
      
      const stats = await response.json();
      res.json(stats);
    } catch (error) {
      console.error("Server API Error:", error);
      res.status(500).json({ error: "Failed to fetch team stats from CTFtime" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
