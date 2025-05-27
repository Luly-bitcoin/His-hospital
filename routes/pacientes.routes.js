const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacientes.controller');

router.get('/', pacienteController.listar);

module.exports = router;
