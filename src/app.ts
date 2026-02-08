import "dotenv/config";

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { loginLimiter } from "./middleware/authMiddleware";
import authRoutes from "./routes/auth.routes";

const MEU_SITE_URL = process.env.HOST as string;

const app: Express = express();

// --- Configuração Swagger ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Basiquinha Node.js",
      version: "1.0.0",
      description: "Documentação dos endpoints",
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3001}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./routes/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

export default app;
