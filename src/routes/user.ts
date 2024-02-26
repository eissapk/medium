import express from "express";
import { loginUser, signupUser, getAllUsers, getUser } from "../controllers/user";

export const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/", getAllUsers);
router.get("/:id", getUser);
