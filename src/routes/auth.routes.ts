import express from "express";
import * as authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", authController.login);
router.get("/refreshtoken", authController.refreshToken);
router.delete("/logout", authController.logout);

export default router;
