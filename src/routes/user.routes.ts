import express from "express";
import * as userController from "../controllers/user.controller";

const router = express.Router();

router.get("/getUserById", userController.getUserById);

export default router;