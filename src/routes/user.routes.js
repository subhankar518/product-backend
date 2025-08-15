import { Router } from "express";
import {
    registerUser,
    loginUser,
    newAccessTokenRequest,
    logoutUser,
    getAllUsers,
    deleteUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/new-access-token").post(newAccessTokenRequest);
// secured route
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/get-all-users").get(verifyJWT, getAllUsers);
userRouter.route("/delete-user").post(verifyJWT, deleteUser);

export default userRouter;

// This is only for understanding

// userRouter
//     .route("/register")
//     .post(upload.single("profilePicture"), registerUser);
