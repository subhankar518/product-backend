import { DataTypes } from "sequelize";

const createOrderItemModel = (sequelize) => {
    const OrderItem = sequelize.define("OrderItem", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 },
        },
        unitPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 0 },
        },
        totalPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 0 },
        },
    });

    return OrderItem;
};

export default createOrderItemModel;
