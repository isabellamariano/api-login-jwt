import "dotenv/config";

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";

import { apiReference } from "@scalar/express-api-reference";
import { authorizeRole, limiter, loginLimiter } from "./middleware/authMiddleware";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const MEU_SITE_URL = process.env.HOST as string;

const app: Express = express();

// --- Configuração Doc ---
app.use('/api-docs', (req, res, next) => {
  try {
    const swaggerDoc = require('../dist/swagger.json');
    return apiReference({
      content: swaggerDoc,
      theme: 'purple',
      layout: 'modern',
      forceDarkModeState: 'dark',
      expandAllResponses: true,
      hideDownloadButton: true,
      hideModels: true,
      hideClientButton: true,
      persistAuth: true,
      shouldIncludeCookies: true,
      defaultHttpClient: {
        targetKey: 'node',
        clientKey: 'undici',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Em desenvolvimento',
        },
        {
          url: 'https://host-sua-api.com',
          description: 'Em produção',
        }
      ],
      authentication: {
        preferredSecurityScheme: ['bearerAuth', 'apiKeyHeader'],
        securitySchemes: {
          bearerAuth: {
            token: 'xyz token value',
          },
          apiKeyHeader: {
            name: 'x-service-key',
            in: 'header',
            value: 'tokenValue',
          },
        }
      }
    })(req, res);
  } catch (e) {
    res.send('Aguardando geração do Swagger... Recarregue em instantes.');
  }
});
// ----------------------------

app.use(
  cors({
    origin: MEU_SITE_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-service-key"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", loginLimiter, authRoutes);
app.use("/user", limiter, authorizeRole, userRoutes)

export default app;
