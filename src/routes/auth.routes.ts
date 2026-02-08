import express from "express";
import * as authController from "../controllers/auth.controller";
import { loginLimiter } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Login to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: tester
 *               senha:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 status_descricao:
 *                   type: string  
 *       400:
 *         description: Dados obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 status_descricao:
 *                   type: string
 *       401:
 *         description: Não Autorizado
 *       403:
 *         description: Forbiden
 *       429:
 *         description: Erro de base
 */
router.post("/login", loginLimiter, authController.login);

/**
 * @openapi
 * /auth/refreshtoken:
 *   get:
 *     summary: Atualiza o token de acesso
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 status_descricao:
 *                   type: string  
 *       400:
 *         description: Dados obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 status_descricao:
 *                   type: string
 *       401:
 *         description: Não Autorizado
 *       403:
 *         description: Forbiden
 *       429:
 *         description: Erro de base
 */
router.get("/refreshtoken", loginLimiter, authController.refreshToken);

/**
 * @openapi
 * /auth/logout:
 *   delete:
 *     summary: Encerra a sessão
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 status_descricao:
 *                   type: string 
 */
router.delete("/logout", authController.logout);

export default router;
