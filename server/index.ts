import express, { type Request, Response, NextFunction } from "express";
import compression from 'compression';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import http from "http"; // Добавлен явный импорт http для создания сервера

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Enable gzip/brotli compression for responses
app.use(compression());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const jsonString = JSON.stringify(capturedJsonResponse);
        // Ограничиваем длину JSON в логе
        logLine += ` :: ${jsonString.length > 50 ? jsonString.substring(0, 47) + "…" : jsonString}`;
      }

      if (logLine.length > 100) {
        logLine = logLine.slice(0, 99) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Исправление: явно создаем HTTP-сервер, если registerRoutes не возвращает его, 
  // или оставляем await registerRoutes(app) если он возвращает настроенный сервер
  // Судя по контексту, registerRoutes возвращает сервер, но для надежности:
  const server = await registerRoutes(app); 

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    // throw err; // Удаляем throw, так как ошибка уже обработана
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  // КОРРЕКТИРОВКА: Устанавливаем '127.0.0.1' по умолчанию для Windows-совместимости
  const host = process.env.HOST || "127.0.0.1"; 
  
  // КОРРЕКТИРОВКА: Используем server.listen(port, host, callback) для устранения ENOTSUP
  server.listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
  });
})();