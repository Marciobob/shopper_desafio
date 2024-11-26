"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
//Listar usuarios
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.findAll();
});
//cadastrar usuarios
const createUser = (customer_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.default.create({ customer_id });
});
//Atualizar usuarios
const updateUser = (customer_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByPk(customer_id);
    if (!user)
        throw new Error('Usuário não encontrado');
    yield user.save();
    return user;
});
//Deletar usuarios
const deleteUser = (customer_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByPk(customer_id);
    if (!user)
        throw new Error('Usuário não encontrado');
    yield user.destroy();
});
exports.default = { getAllUsers, createUser, updateUser, deleteUser };
