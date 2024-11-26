"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Viagem extends sequelize_1.Model {
}
Viagem.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_id: {
        type: sequelize_1.DataTypes.INTEGER, // Certifique-se de que o tipo corresponde ao `id` no modelo User
        allowNull: false,
        references: {
            model: 'users', // Nome da tabela do modelo User
            key: 'id', // Nome da coluna primária no modelo User
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Pode ser 'SET NULL' ou outra regra dependendo da lógica do negócio
    },
    origin: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    distance: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    driver_id: {
        type: sequelize_1.DataTypes.INTEGER, // O tipo deve ser compatível com a chave primária do modelo Motorista
        allowNull: false, // Defina como obrigatório se sempre precisar de um motorista para a viagem
        references: {
            model: 'motoristas', // Nome da tabela associada ao modelo Motorista
            key: 'id', // A coluna primária da tabela Motorista
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Altere para 'SET NULL' ou 'RESTRICT', dependendo da sua lógica de negócio
    },
    value: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'Viagem',
    tableName: 'viagens', // Nome da tabela no banco de dados
});
exports.default = Viagem;
