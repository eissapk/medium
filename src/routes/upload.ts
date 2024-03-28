import express from "express";
import { uploadByFile, uploadByUrl } from "../controllers/upload";
import auth from "../middleware/auth";

const router = express.Router();

router.use(auth); // protect below routes

router.post("/byfile", uploadByFile);
router.post("/byurl", uploadByUrl);

export default router;
