import { Router } from "express";

import {
    signup,
    login,
    logout,
    getCurrentUser,
    refreshAccessToken,
} from "../controllers/auth.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);


//  Protected Routes

router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getCurrentUser);

export default router;