"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || 'database.sqlite', // Arquivo SQLite
    logging: console.log, // Define explicitamente o console.log para evitar o aviso
});
// Exportar a instância do Sequelize para uso em outros arquivos
exports.default = sequelize;
