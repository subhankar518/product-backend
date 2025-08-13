import { Product } from "../db/connectDb.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
    // console.log("product");
    const { name, description, price, stock } = req.body;
    if (!name || price == null)
        throw new ApiError(400, "Name & price required");

    const product = await Product.create({
        name,
        description,
        price,
        stock: stock ?? 0,
    });
    return res
        .status(201)
        .json(new ApiResponse(201, { product }, "Product created"));
});

export const getAllProducts = asyncHandler(async (_req, res) => {
    const products = await Product.findAll({ order: [["id", "ASC"]] });
    return res.status(200).json(new ApiResponse(200, { products }, "OK"));
});
