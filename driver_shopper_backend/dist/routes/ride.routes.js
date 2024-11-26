"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ride_controller_1 = require("../controllers/ride.controller");
const router = (0, express_1.Router)();
// Rota para confirmar a viagem e caucular a viagem
router.post('/confirm', ride_controller_1.confirmRide);
router.post('/estimate', ride_controller_1.estimateRide);
router.get('/:customer_id/:driver_id?', ride_controller_1.listRide);
exports.default = router;
