import { sequelize, Product, Order, OrderItem } from "../db/connectDb.js";
import { ApiError } from "../utils/ApiError.js";
import { literal } from "sequelize";

export const placeOrder = async ({ userId, items }) => {
    // combineing all duplicate products
    const quantityMap = new Map();
    for (const { productId, quantity } of items) {
        const currentQty = quantityMap.get(productId) || 0;
        quantityMap.set(productId, currentQty + Number(quantity || 0));
    }

    const normalizedItems = [...quantityMap.entries()].map(
        ([productId, quantity]) => ({
            productId,
            quantity,
        })
    );

    // Main logic
    // using transaction
    const transaction = await sequelize.transaction();

    try {
        const orderItems = [];
        let totalOrderRupee = 0;

        for (const { productId, quantity } of normalizedItems) {
            // checking product exists or not
            const product = await Product.findOne({
                where: { id: productId },
                transaction,
            });

            if (!product) {
                throw new ApiError(404, `Product ${productId} not found`);
            }

            // checking stock availablity
            if (product.stock < quantity) {
                throw new ApiError(
                    409,
                    `Not enough stock for product ${productId}`
                );
            }

            // deducting stock
            await Product.update(
                { stock: literal(`"stock" - ${quantity}`) },
                {
                    where: { id: productId },
                    transaction,
                }
            );

            const unitRupee = product.price;
            const totalPrice = unitRupee * quantity;
            totalOrderRupee += totalPrice;

            orderItems.push({
                productId,
                quantity,
                unitPrice: unitRupee,
                totalPrice,
            });
        }

        // create order
        const order = await Order.create(
            { userId, totalPrice: totalOrderRupee, status: "confirmed" },
            { transaction }
        );

        await OrderItem.bulkCreate(
            orderItems.map((item) => ({
                ...item,
                orderId: order.id,
            })),
            { transaction }
        );

        // commit
        await transaction.commit();

        return order;
    } catch (error) {
        // rollback
        await transaction.rollback();
        throw error;
    }
};
