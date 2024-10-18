import express from "express";
import authRoutes from "./auth.routes.js";
import queryRoutes from "./query.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/query", queryRoutes);

export default router;
