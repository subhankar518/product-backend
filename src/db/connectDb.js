import { Sequelize } from "sequelize";
import createUserModel from "../models/user.model.js";
import createProductModel from "../models/product.model.js";
import createOrderModel from "../models/order.model.js";
import createOrderItemModel from "../models/orderItem.model.js";

let sequelize, User, Product, Order, OrderItem;

const connectDb = async (database_URL) => {
    sequelize = new Sequelize(database_URL, {
        dialect: "postgres",
        logging: false, // hides raw SQL logs
    });

    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        User = createUserModel(sequelize);
        Product = createProductModel(sequelize);
        Order = createOrderModel(sequelize);
        OrderItem = createOrderItemModel(sequelize);

        User.hasMany(Order, { foreignKey: "userId" });
        Order.belongsTo(User, { foreignKey: "userId" });

        Order.hasMany(OrderItem, { foreignKey: "orderId" });
        OrderItem.belongsTo(Order, { foreignKey: "orderId" });

        Product.hasMany(OrderItem, { foreignKey: "productId" });
        OrderItem.belongsTo(Product, { foreignKey: "productId" });

        await sequelize.sync({ alter: true });
        console.log("Models synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error.message);
    }
};

export { connectDb, User, Product, Order, OrderItem, sequelize };
