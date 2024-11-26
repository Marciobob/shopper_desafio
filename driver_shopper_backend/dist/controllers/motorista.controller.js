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
exports.deleteMotorista = exports.updateMotorista = exports.getMotoristaById = exports.getAllMotoristas = exports.createMotorista = void 0;
const motorista_model_1 = __importDefault(require("../models/motorista.model"));
// Criar um novo motorista
const createMotorista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, car, rating, ratePerKm, minKm } = req.body;
    // Validação de campos obrigatórios
    if (!name || !car || ratePerKm === undefined || minKm === undefined) {
        return res.status(400).json({
            message: 'Os campos nome, carro, taxa por km e quilometragem mínima são obrigatórios.',
        });
    }
    try {
        // Criação do motorista
        const motorista = yield motorista_model_1.default.create({
            name,
            description,
            car,
            rating: rating || 0, // Default para 0 caso não seja informado
            ratePerKm,
            minKm,
        });
        return res.status(201).json(motorista);
    }
    catch (error) {
        console.error('Erro ao criar motorista:', error);
        return res.status(500).json({ message: 'Erro ao criar motorista' });
    }
});
exports.createMotorista = createMotorista;
//Buscar todos os motoristas
const getAllMotoristas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const motoristas = yield motorista_model_1.default.findAll();
        res.status(200).json(motoristas);
    }
    catch (error) {
        console.error('Erro ao buscar motoristas:', error);
        res.status(500).json({ message: 'Erro ao buscar motoristas' });
    }
});
exports.getAllMotoristas = getAllMotoristas;
//Buscar motorista por ID
const getMotoristaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const motorista = yield motorista_model_1.default.findByPk(id);
        if (motorista) {
            res.status(200).json(motorista);
        }
        else {
            res.status(404).json({ message: 'Motorista não encontrado' });
        }
    }
    catch (error) {
        console.error('Erro ao buscar motorista:', error);
        res.status(500).json({ message: 'Erro ao buscar motorista' });
    }
});
exports.getMotoristaById = getMotoristaById;
//Atualizar motorista
const updateMotorista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, car, rating, ratePerKm, minKm } = req.body;
    try {
        const motorista = yield motorista_model_1.default.findByPk(id);
        if (motorista) {
            motorista.name = name || motorista.name;
            motorista.description = description || motorista.description;
            motorista.car = car || motorista.car;
            motorista.rating = rating || motorista.rating;
            motorista.ratePerKm = ratePerKm || motorista.ratePerKm;
            motorista.minKm = minKm || motorista.minKm;
            yield motorista.save();
            res.status(200).json(motorista);
        }
        else {
            res.status(404).json({ message: 'Motorista não encontrado' });
        }
    }
    catch (error) {
        console.error('Erro ao atualizar motorista:', error);
        res.status(500).json({ message: 'Erro ao atualizar motorista' });
    }
});
exports.updateMotorista = updateMotorista;
//Remover motorista
const deleteMotorista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const motorista = yield motorista_model_1.default.findByPk(id);
        if (motorista) {
            yield motorista.destroy();
            res.status(200).json({ message: 'Motorista removido com sucesso' });
        }
        else {
            res.status(404).json({ message: 'Motorista não encontrado' });
        }
    }
    catch (error) {
        console.error('Erro ao excluir motorista:', error);
        res.status(500).json({ message: 'Erro ao excluir motorista' });
    }
});
exports.deleteMotorista = deleteMotorista;
