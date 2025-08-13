import { DataTypes } from "sequelize";

const createProductModel = (sequelize) => {
    const Product = sequelize.define(
        "Product",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(200),
                allowNull: false,
                unique: true,
            },
            description: { type: DataTypes.TEXT, allowNull: true },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: { min: 0 },
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: { min: 0 },
            },
        },
        {
            indexes: [{ unique: true, fields: ["name"] }],
        }
    );

    return Product;
};

export default createProductModel;
