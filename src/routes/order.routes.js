import { Router } from "express";
import { createOrder, getAllOrders } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const orderRouter = Router();
// secured route
orderRouter.route("/create-order").post(verifyJWT, createOrder);
orderRouter.route("/get-all-orders").get(verifyJWT, getAllOrders);

export default orderRouter;
