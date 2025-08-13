import { DataTypes } from "sequelize";

const createOrderModel = (sequelize) => {
    const Order = sequelize.define(
        "Order",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            status: {
                type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
                allowNull: false,
                defaultValue: "pending",
            },
            totalPrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: { min: 0 },
            },
        },
        {
            tableName: "orders",
            timestamps: true,
        }
    );

    return Order;
};

export default createOrderModel;
