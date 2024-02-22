import express from "express";
import { loginUser, signupUser } from "../controllers/user";

export const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
