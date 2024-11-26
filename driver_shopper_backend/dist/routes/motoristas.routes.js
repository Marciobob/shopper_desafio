"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const motorista_controller_1 = require("../controllers/motorista.controller");
const router = (0, express_1.Router)();
// Rota para confirmar a viagem e caucular a viagem
router.post('/createMotorista', motorista_controller_1.createMotorista);
router.get('/getAllMotoristas', motorista_controller_1.getAllMotoristas);
exports.default = router;
