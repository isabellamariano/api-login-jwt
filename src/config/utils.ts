import * as fs from "fs";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import { defaultResponse } from "../interfaces/default.interface";
import { jwtPayload } from "../interfaces/jwtPayload.interface";

const JWS_SECRET = process.env.SECRET as string;

const maxAge = "15d"; // 15 dias
const maxSession = 15 * 60; // 15 minutos

export function createToken(payload: jwtPayload) {
  return jwt.sign(payload, JWS_SECRET, {
    expiresIn: maxSession,
  });
}

export function refreshToken(payload: any) {
  return jwt.sign(payload, JWS_SECRET, {
    expiresIn: maxAge,
  });
}

export function validaRTK(rfk: any) {
  return jwt.verify(rfk, JWS_SECRET) as any;
}

export function handleErrors(err: any, msg?: string) {
  let error;
  if (err.code === 11000) {
    for (const key in err.errorResponse.keyValue) {
      error = `${err.errorResponse.keyValue[key]} ${msg}`;
    }
    return defaultResponse(`${error}`);
  }
  if (err.code === -11000) {
    error = `ERR-${msg}`;
  }
  if (err instanceof TypeError) {
    error = `ERR-${err.message}`;
  }
  if (err instanceof Error) {
    error = `ERR-${err.message}`;
  }
  return defaultResponse(`${error}`);
}

export function logToDailyFile(message: string, prefix?: string): void {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
  const fileName = `${prefix || "app"}_${dateStr}.log`;
  logToFile(message, fileName);
}

export function logToFile(message: string, logFileName?: string): void {
  try {
    const fileName = logFileName || "app.log";
    const logDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const filePath = path.join(logDir, fileName);
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(filePath, formattedMessage, "utf8");
  } catch (error) {
    console.error("Erro ao escrever no arquivo de log:", error);
    console.log(message);
  }
}
