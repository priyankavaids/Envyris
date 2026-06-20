import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import nodemailer from "nodemailer";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      {
        name: "gmail-email-proxy",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url !== "/api/send-email" || req.method !== "POST") {
              return next();
            }

            let body = "";
            for await (const chunk of req) {
              body += chunk;
            }

            try {
              const payload = JSON.parse(body);
              const driver = env.VITE_EMAIL_DRIVER ?? "gmail";

              if (driver !== "gmail") {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: `Unsupported email driver: ${driver}` }));
                return;
              }

              const user = env.VITE_GMAIL_USER;
              const pass = env.VITE_GMAIL_PASS;

              if (!user || !pass) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Gmail SMTP credentials are not configured. Set VITE_GMAIL_USER and VITE_GMAIL_PASS." }));
                return;
              }

              const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                  user,
                  pass,
                },
              });

              const info = await transporter.sendMail({
                from: user,
                to: payload.to,
                subject: payload.subject,
                text: payload.text,
                html: payload.html,
              });

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(info));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
            }
          });
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
