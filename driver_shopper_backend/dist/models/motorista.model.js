"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Motorista extends sequelize_1.Model {
}
Motorista.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    car: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    ratePerKm: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    minKm: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
}, {
    sequelize: database_1.default,
    modelName: 'Motorista',
    tableName: 'motoristas',
});
exports.default = Motorista;