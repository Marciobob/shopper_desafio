"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = (0, express_1.Router)();
//Rotas para cadastro busca e deletar um usuario 
router.get('/', user_controller_1.default.getAllUsers);
router.post('/', user_controller_1.default.createUser);
router.put('/:customer_id', user_controller_1.default.updateUser);
router.delete('/:customer_id', user_controller_1.default.deleteUser);
exports.default = router;
