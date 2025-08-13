import { Router } from "express";
import { createOrder } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const orderRouter = Router();
// secured route
orderRouter.route("/create-order").post(verifyJWT, createOrder);

export default orderRouter;
