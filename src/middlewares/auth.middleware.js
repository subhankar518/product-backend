import jwt from "jsonwebtoken";
import { User } from "../db/connectDb.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token =
            req.cookies?.accessToken ||
            (authHeader && authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : null);

        if (!token) {
            throw new ApiError(401, "Unauthorized Request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const currentUser = await User.findByPk(decodedToken?.id, {
            attributes: { exclude: ["password", "refreshToken"] },
        });

        if (!currentUser) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = currentUser;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

// const authenticateToken = async (req, res, next) => {
//     const token = req.headers["authorization"].split(" ")[1];
//     if (!token) {
//         return res.status(401).json("Invalid token");
//     }
//     jwt.verify(token, "abcd", async (error, decoded) => {
//         if (error) {
//             return res.status(403).json("Token Expired");
//         }
//         next();
//     });
// };
