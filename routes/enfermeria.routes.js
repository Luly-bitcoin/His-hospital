import express from 'express';
import enfermeriaController from '../controllers/enfermeria.controllers.js';

const router = express.Router();

router.get('/', enfermeriaController.getEvaluacion);
router.post('/', enfermeriaController.postEvaluacion);

export default router;
