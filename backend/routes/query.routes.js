import express from "express";
import protectRoute from "../middleware/protectRoute.js";
//import controllers here
import { createDataset } from "../controllers/query.controller.js";

const router = express.Router();

router.post("/create-dataset", protectRoute, createDataset);

export default router;
