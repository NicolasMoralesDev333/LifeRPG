import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "dist");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://127.0.0.1:${port}`);
  const safePath = path.normalize(requestUrl.pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath === "/" ? "index.html" : safePath);

  try {
    const file = await readFile(filePath);
    const extension = path.extname(filePath);

    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
    });
    response.end(file);
  } catch {
    const fallback = await readFile(path.join(root, "index.html"));

    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(fallback);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`LifeRPG preview running at http://127.0.0.1:${port}`);
});
