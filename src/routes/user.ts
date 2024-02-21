import express from "express";
import { loginUser, signupUser } from "../controllers/user";

const router = express.Router();
// no need to verify token here as we make it already and send it to client

// login
router.post("/login", loginUser);

// signup
router.post("/signup", signupUser);

export default router;
