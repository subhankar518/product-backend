import { User } from "../db/connectDb.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcryptjs from "bcryptjs";
import { Op } from "sequelize";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/tokenGenerator.js";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullName, phone, role } = req.body;

    // if (
    //     [fullName, email, username, password, phone].some(
    //         (field) => !field || field.trim() === ""
    //     )
    // ) {
    //     throw new ApiError(400, "All fields are required");
    // }

    // need to emplement all the checks

    const existUser = await User.findOne({
        where: {
            [Op.or]: [{ username }, { email }, { phone }],
        },
    });

    if (existUser) {
        throw new ApiError(
            409,
            "User with this username, email, or phone already exists"
        );
    }

    const hashedPass = await bcryptjs.hash(password, 10);

    const userResponse = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        phone,
        password: hashedPass,
        role,
    });

    if (!userResponse) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    const {
        password: _,
        refreshToken,
        ...userWithoutSensitiveFields
    } = userResponse.toJSON();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                userWithoutSensitiveFields,
                "User registered successfully"
            )
        );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }
    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    try {
        let existedUser;
        if (username) {
            existedUser = await User.findOne({ where: { username: username } });
        } else
            existedUser = await User.findOne({
                where: {
                    email: email,
                },
            });

        if (!existedUser) {
            return res.status(404).json("User does not exist");
        }

        console.log("existedUser", existedUser);

        const isValid = await bcryptjs.compare(password, existedUser.password);
        if (!isValid) {
            return res.status(401).json("Invalid credentials");
        }

        const accessToken = generateAccessToken(existedUser.dataValues);
        const refreshToken = generateRefreshToken(existedUser.dataValues);

        await existedUser.update({ refreshToken });

        const {
            password: pwd,
            refreshToken: rToken,
            ...userData
        } = existedUser.dataValues;

        const accessOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 5 * 60 * 1000, // 5 minutes
        };
        const refreshOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 10 * 60 * 1000, // 10 minutes
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, accessOptions)
            .cookie("refreshToken", refreshToken, refreshOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: userData,
                        accessToken,
                        refreshToken,
                    },
                    "User logged in successfully"
                )
            );
    } catch (e) {
        console.error(e);
        res.status(500).json("Internal Server Error");
    }
});

export const newAccessTokenRequest = asyncHandler(async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new ApiError(401, "Unauthorized Request");
        }
        // console.log("refreshToken", refreshToken);

        const user = await User.findOne({
            where: { refreshToken: refreshToken },
        });

        if (!user) {
            throw new ApiError(404, "User not found for this refresh token");
        }

        console.log("user.dataValues", user.dataValues);
        let decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        // console.log("decodedToken", decodedToken);

        if (!decodedToken) throw new ApiError(401, "Invalid Refresh Token");

        const newAccessToken = generateAccessToken(user.dataValues);

        const options = {
            httpOnly: true,
            secure: true,
            maxAge: 5 * 60 * 1000,
        };

        return res
            .status(200)
            .cookie("accessToken", newAccessToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken: newAccessToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        console.error("Error refreshing access token:", error.message);
        res.status(error.statusCode || 500).json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Internal Server Error"
            )
        );
    }
});

export const logoutUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?.id; // from auth middleware

        if (!userId) {
            throw new ApiError(401, "Unauthorized request");
        }

        await User.update({ refreshToken: null }, { where: { id: userId } });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        };

        return res
            .status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
        console.error("Logout error:", error.message);
        res.status(error.statusCode || 500).json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Internal Server Error"
            )
        );
    }
});
