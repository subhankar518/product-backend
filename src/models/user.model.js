import { DataTypes } from "sequelize";

const createUserModel = (sequelize) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER, // need proper uuid
            autoIncrement: true,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: true,
            unique: true,
            validate: {
                is: /^[0-9]+$/,
            },
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            allowNull: false,
            defaultValue: "user",
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    });

    return User;
};

export default createUserModel;
