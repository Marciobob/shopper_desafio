"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const ride_routes_1 = __importDefault(require("./routes/ride.routes"));
const motoristas_routes_1 = __importDefault(require("./routes/motoristas.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
//Configurar as rotas
app.use('/users', user_routes_1.default);
app.use('/ride', ride_routes_1.default);
app.use('/motoristas', motoristas_routes_1.default);
//Middleware global para tratamento de erros
app.use(error_middleware_1.default);
exports.default = app;
