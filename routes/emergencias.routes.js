import express from 'express';
const router = express.Router();
import emergenciasController from '../controllers/emergencias.controllers.js';

router.get('/', emergenciasController.getIngresoEmergencia);

// API para camas disponibles
router.get('/api/camas/emergencias-disponibles', emergenciasController.getCamasEmergencias);

// API para registrar emergencia
router.post('/api/emergencias', emergenciasController.postRegistrarEmergencia);

export {router};
