import { placeOrder } from "../service/order.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { OrderItem } from "../db/connectDb.js";

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

export const getAllOrders = asyncHandler(async (req, res) => {
    try {
        if (req.user?.role != "admin") {
            throw new ApiError(401, "Unauthorized request");
        }
        const allOrders = await OrderItem.findAll();
        res.status(200).json(
            new ApiResponse(
                200,
                { allOrders },
                "All Order fetched Successfully !"
            )
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(error.statusCode || 500).json(
            new ApiResponse(
                error.statusCode || 500,
                null,
                error.message || "Internal Server Error"
            )
        );
    }
});
