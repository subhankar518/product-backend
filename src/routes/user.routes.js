import { Router } from "express";
import {
    registerUser,
    loginUser,
    newAccessTokenRequest,
    logoutUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/new-access-token").post(newAccessTokenRequest);
// secured route
userRouter.route("/logout").post(verifyJWT, logoutUser);

export default userRouter;
