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
exports.listRide = exports.estimateRide = exports.confirmRide = void 0;
const motorista_model_1 = __importDefault(require("../models/motorista.model"));
const viagem_model_1 = __importDefault(require("../models/viagem.model"));
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const user_service_1 = __importDefault(require("../services/user.service"));
const user_model_1 = __importDefault(require("../models/user.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../.env' });
const client = new google_maps_services_js_1.Client();
//Confirmar Viagem
const confirmRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_id, origin, destination, distance, duration, driver, value } = req.body;
    // 1. Validação dos dados recebidos
    if (!customer_id || !origin || !destination || !driver || !distance || !duration || !value) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Todos os campos são obrigatórios',
        });
    }
    if (origin === destination) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Os endereços de origem e destino não podem ser os mesmos',
        });
    }
    // 2. Verificar se o motorista existe
    const motorista = yield motorista_model_1.default.findByPk(driver.id);
    if (!motorista) {
        return res.status(404).json({
            error_code: 'DRIVER_NOT_FOUND',
            error_description: 'Motorista não encontrado',
        });
    }
    // 3. Validar a quilometragem
    if (distance < motorista.minKm) {
        return res.status(406).json({
            error_code: 'INVALID_DISTANCE',
            error_description: 'A quilometragem informada é inválida para o motorista selecionado',
        });
    }
    // 4. Calcular o valor da viagem 
    const calculatedValue = parseFloat((distance * motorista.ratePerKm).toFixed(2));
    if (value !== calculatedValue) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'O valor informado não corresponde ao valor calculado',
        });
    }
    //verificar se user existe se não criar um novo
    // 2. Verificar se o motorista existe
    const usuario = yield user_model_1.default.findByPk(customer_id);
    if (!usuario) {
        const newUser = yield user_service_1.default.createUser(customer_id);
    }
    // 5. Salvar a viagem no banco de dados
    try {
        const viagem = yield viagem_model_1.default.create({
            customer_id,
            origin,
            destination,
            distance,
            duration,
            driver_id: motorista.id,
            value,
        });
        return res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        console.error('Erro ao salvar viagem:', error);
        return res.status(500).json({
            error_code: 'SERVER_ERROR',
            error_description: 'Erro ao salvar a viagem',
        });
    }
});
exports.confirmRide = confirmRide;
// Calcular viagem
const estimateRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_id, origin, destination } = req.body;
    if (!customer_id || !origin || !destination) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Campos obrigatórios: customer_id, origin e destination.',
        });
        return;
    }
    if (origin === destination) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Os endereços de origem e destino não podem ser iguais.',
        });
        return;
    }
    try {
        const response = yield client.directions({
            params: {
                origin,
                destination,
                key: process.env.GOOGLE_API_KEY,
            },
        });
        const route = response.data.routes[0];
        if (!route) {
            res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: 'Não foi possível calcular a rota com os endereços fornecidos.',
            });
            return;
        }
        const leg = route.legs[0];
        const distanceInKm = leg.distance.value / 1000;
        const duration = leg.duration.text;
        const originLatLng = leg.start_location;
        const destinationLatLng = leg.end_location;
        const availableDrivers = yield motorista_model_1.default.findAll();
        const res_motoristas = availableDrivers.filter(driver => distanceInKm >= driver.minKm)
            .map(driver => ({
            id: driver.dataValues.id,
            name: driver.dataValues.name,
            description: driver.dataValues.description,
            vehicle: driver.dataValues.car,
            review: {
                rating: driver.dataValues.rating,
                comment: driver.dataValues.description,
            },
            value: parseFloat((distanceInKm * driver.dataValues.ratePerKm).toFixed(2)),
        }))
            .sort((a, b) => a.value - b.value);
        if (availableDrivers.length === 0) {
            res.status(404).json({
                error_code: 'NO_DRIVERS',
                error_description: 'Nenhum motorista disponível para a distância informada.',
            });
            return;
        }
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x600&path=color:0d1723|weight:5|${originLatLng.lat},${originLatLng.lng}|${destinationLatLng.lat},${destinationLatLng.lng}&markers=color:red|${originLatLng.lat},${originLatLng.lng}&markers=color:green|${destinationLatLng.lat},${destinationLatLng.lng}&key=${process.env.GOOGLE_API_KEY}`;
        res.status(200).json({
            origin: {
                latitude: originLatLng.lat,
                longitude: originLatLng.lng,
            },
            destination: {
                latitude: destinationLatLng.lat,
                longitude: destinationLatLng.lng,
            },
            distance: distanceInKm,
            duration,
            options: res_motoristas,
            routeResponse: route,
            urlMapa: mapUrl
        });
    }
    catch (error) {
        console.error('Erro ao calcular a rota:', error);
        res.status(500).json({
            error_code: 'SERVER_ERROR',
            error_description: 'Erro ao processar a solicitação. Tente novamente mais tarde.',
        });
    }
});
exports.estimateRide = estimateRide;
// Listar viagens
const listRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id, driver_id } = req.params;
        // Validação 1: O `customer_id` não pode estar em branco
        if (!customer_id) {
            return res.status(400).json({
                error_code: "INVALID_CUSTOMER",
                error_description: "O ID do usuário não pode estar em branco.",
            });
        }
        // Validação 2: Se `driver_id` for informado, verificar se é válido
        if (driver_id) {
            const motorista = yield motorista_model_1.default.findByPk(driver_id);
            if (!motorista) {
                return res.status(400).json({
                    error_code: "INVALID_DRIVER",
                    error_description: "O ID do motorista é inválido.",
                });
            }
        }
        // Construir condições de busca
        const whereConditions = { customer_id };
        if (driver_id) {
            whereConditions.driver_id = driver_id;
        }
        // Buscar as viagens no banco de dados
        const viagens = yield viagem_model_1.default.findAll({
            where: whereConditions,
            order: [["createdAt", "DESC"]], // Ordenar da mais recente para a mais antiga
            include: [
                {
                    model: motorista_model_1.default,
                    as: "driver", // Alias definido no relacionamento Viagem -> Motorista
                },
                {
                    model: user_model_1.default,
                    as: "user", // Alias definido no relacionamento Viagem -> User
                },
            ],
        });
        // Verificar se encontrou viagens
        if (viagens.length === 0) {
            return res.status(404).json({
                error_code: "NO_RIDES_FOUND",
                error_description: "Nenhuma viagem encontrada para o usuário informado.",
            });
        }
        // Construir a resposta
        const response = {
            customer_id,
            rides: viagens.map((viagem) => {
                var _a, _b;
                return ({
                    id: viagem.id,
                    date: viagem.createdAt,
                    origin: viagem.origin,
                    destination: viagem.destination,
                    distance: viagem.distance,
                    duration: viagem.duration,
                    driver: {
                        id: ((_a = viagem.driver) === null || _a === void 0 ? void 0 : _a.id) || null,
                        name: ((_b = viagem.driver) === null || _b === void 0 ? void 0 : _b.name) || null,
                    },
                    value: viagem.value,
                });
            }),
        };
        // Retornar a resposta com sucesso
        return res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: "Ocorreu um erro ao processar a solicitação.",
        });
    }
});
exports.listRide = listRide;
