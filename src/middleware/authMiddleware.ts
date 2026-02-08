import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { defaultResponse } from "../interfaces/default.interface";
import { jwtPayload } from "../interfaces/jwtPayload.interface";

const JWS_SECRET = process.env.SECRET as string;
const SERVICE_API_KEY = process.env.SECRET_SERV as string;
const MEU_SITE_URL = process.env.HOST as string;

declare global {
  namespace Express {
    interface Request {
      user?: jwtPayload;
    }
  }
}

export const limiter = rateLimit({
  windowMs: 1000,
  max: (req: Request) => {
    const isFromMySite = req.headers.origin === MEU_SITE_URL;
    const hasValidKey = req.headers["x-service-key"] === SERVICE_API_KEY;
    if (isFromMySite && hasValidKey) {
      return 30;
    }
    return 1;
  },
  handler: (req, res, next, options) => {
    const isFromMySite = req.headers.origin === MEU_SITE_URL;
    if (!isFromMySite) {
      return res.status(403).json(defaultResponse("Acesso negado. Esta API é exclusiva para o site oficial."));
    }
    return res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Muitas tentativas de login. Tente novamente em 1 minuto.",
});

export const authorizeRole = (requiredRole: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).send(defaultResponse("Token não informado."));
    }
    const accessToken = auth.slice(7, auth.length);
    try {
      const decoded = jwt.verify(accessToken, JWS_SECRET) as jwtPayload;

      const rolesRequeridas = requiredRole.some((role: string) =>
        decoded.roles!.includes(role),
      );

      if (!rolesRequeridas) {
        return res
          .status(403)
          .json(defaultResponse("Acesso negado. Permissão insuficiente."));
      }

      req.user = decoded;

      return next();
    } catch (error) {
      res.status(401).send(defaultResponse("Token inválido ou expirado."));
    }
  };
};
