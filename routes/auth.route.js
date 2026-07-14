import express from "express";
import { login, checkAuth } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/check", authMiddleware, checkAuth);

export default router;
