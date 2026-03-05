import { pathToFileURL } from "url";
import path from "path";
import { config } from "dotenv";

config();

export default function viteApiPlugin() {
  return {
    name: "vite-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();

        const route = req.url.split("?")[0].replace(/^\/api\//, "");
        const handlerPath = path.resolve("api", `${route}.js`);

        let body = "";
        await new Promise((resolve) => {
          req.on("data", (chunk) => (body += chunk));
          req.on("end", resolve);
        });

        const mockReq = {
          method: req.method,
          headers: req.headers,
          url: req.url,
          body: body ? JSON.parse(body) : {},
        };

        const mockRes = {
          statusCode: 200,
          _headers: {},
          setHeader(k, v) { this._headers[k] = v; },
          status(code) { this.statusCode = code; return this; },
          json(data) {
            res.writeHead(this.statusCode, {
              ...this._headers,
              "Content-Type": "application/json",
            });
            res.end(JSON.stringify(data));
          },
          end() { res.writeHead(this.statusCode, this._headers); res.end(); },
        };

        try {
          const fileUrl = pathToFileURL(handlerPath).href + `?t=${Date.now()}`;
          const mod = await import(fileUrl);
          await mod.default(mockReq, mockRes);
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}
