import express from "express";
import { search } from "../controllers/search";
import auth from "../middleware/auth";

const router = express.Router();

router.use(auth); // protect below routes

router.get("/:query", search);

export default router;
