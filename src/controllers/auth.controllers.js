import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.models.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken"
import mongoose from 'mongoose';

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) throw new ApiError(404, "User not found");
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.error("Token error : ",error)
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const signup = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are required")
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const user = await User.create({
        email,
        password
    });

    if (!user) {
        throw new ApiError(500, "User creation failed, please try again")
    }

    const options = {
        httpOnly: true,
        secure: false,
        samesite: "Lax"
    }

    const createdUser = await User.findById(user.id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Error retrieving newly created user")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(createdUser._id);

    if (!accessToken || !refreshToken) {
        throw new ApiError(500, "Failed to generate authentication tokens");
    }

    res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, createdUser, "User successfully signed up")
        )
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        throw new ApiError(400, "All fields required");

    const user = await User.findOne({ email }).select("+password");

    if (!user)
        throw new ApiError(404, "User does not exist");

    const isValidPassword = await user.isPasswordCorrect(password);

    if (!isValidPassword)
        throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    };

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInUser, "Login successful"));
});

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )

    const options = {
        httponly: true,
        secure: false,
        samesite: "Lax"
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out")
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
        .json(new ApiResponse(200,
            req.user,
            "Current user fetched successsfully")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorised Access");
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (err) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token expired or already used")
    }

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "Lax"
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    if (!accessToken || !refreshToken) {
        throw new ApiError(500, "Failed to generate authentication tokens")
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken },
                "Access token refreshed"
            )
        )
})

export {
    signup,
    login,
    logout,
    getCurrentUser,
    refreshAccessToken
}