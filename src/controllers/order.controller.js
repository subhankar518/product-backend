import { placeOrder } from "../service/order.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id; // from verifyJWT
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, "Atleast one item is required");
    }

    const order = await placeOrder({ userId, items });
    return res
        .status(201)
        .json(new ApiResponse(201, { order }, "Order placed"));
});
