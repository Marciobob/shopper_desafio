"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const viagem_model_1 = __importDefault(require("../models/viagem.model"));
const motorista_model_1 = __importDefault(require("../models/motorista.model"));
const database_1 = __importDefault(require("../config/database")); // Certifique-se de importar a instância do Sequelize
// 1. Associar User -> Viagem (Um usuário pode ter várias viagens)
user_model_1.default.hasMany(viagem_model_1.default, { foreignKey: 'customer_id', as: 'viagens' });
viagem_model_1.default.belongsTo(user_model_1.default, { foreignKey: 'customer_id', as: 'user' });
// 2. Associar Viagem -> Motorista (Cada viagem tem um motorista)
motorista_model_1.default.hasMany(viagem_model_1.default, { foreignKey: 'driver_id', as: 'rides' });
viagem_model_1.default.belongsTo(motorista_model_1.default, { foreignKey: 'driver_id', as: 'driver' });
// (async () => {
//     try {
//       await sequelize.sync({ force: true }); // Recria as tabelas
//       console.log('Banco de dados sincronizado.');
//     } catch (error) {
//       console.error('Erro ao sincronizar o banco:', error);
//     }
//   })();
exports.default = database_1.default;
