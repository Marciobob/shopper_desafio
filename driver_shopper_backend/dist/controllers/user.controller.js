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
const user_service_1 = __importDefault(require("../services/user.service"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_service_1.default.getAllUsers();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        const newUser = yield user_service_1.default.createUser(user);
        res.status(201).json(newUser);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { user } = req.body;
        const updatedUser = yield user_service_1.default.updateUser(user);
        res.json(updatedUser);
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield user_service_1.default.deleteUser(Number(id));
        res.json({ message: 'Usuário deletado com sucesso.' });
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
});
exports.default = { getAllUsers, createUser, updateUser, deleteUser };
