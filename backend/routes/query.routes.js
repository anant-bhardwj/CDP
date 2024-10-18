import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createDataset } from "../controllers/query.controller.js";
//import controllers here

const router = express.Router();

router.post("/create-dataset", protectRoute, createDataset);

// router.get("/:id", protectRoute, getMessages);
// router.post("/send/:id", protectRoute, sendMessage);

export default router;
