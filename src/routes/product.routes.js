import { Router } from "express";
import {
    createProduct,
    getAllProducts,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const productRouter = Router();

// secured route
productRouter.route("/create-product").post(verifyJWT, createProduct);
productRouter.route("/allproduct").get(verifyJWT, getAllProducts);

export default productRouter;
