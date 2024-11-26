"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../.env' });
const database_1 = __importDefault(require("./config/database"));
const app_1 = __importDefault(require("./app"));
require("./config/index");
// Porta definida no .env ou padrão 8080
const PORT = process.env.PORT || 8080;
// sequelize.sync({ alter: true });
// Sincronização do banco de dados antes de iniciar o servidor
database_1.default.sync({ force: false }) // `force: false` para não sobrescrever dados existentes
    .then(() => {
    console.log('Banco de dados conectado e sincronizado.');
    app_1.default.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1); // Encerra o processo com código de erro
});
