"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Middleware global para tratamento de erros
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno no servidor.' });
};
exports.default = errorMiddleware;
