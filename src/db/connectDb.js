import { Sequelize } from "sequelize";
import createUserModel from "../models/user.model.js";

let User = null;

const connectDb = async (database_URL) => {
    const sequelize = new Sequelize(database_URL, {
        dialect: "postgres",
        logging: false, // hides raw SQL logs
    });

    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        // Initialize model
        User = createUserModel(sequelize);

        // Sync tables
        await sequelize.sync({ alter: true });
        console.log("Models synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error.message);
    }
};

export { connectDb, User };
