import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/pacientes/nuevo', (req, res) => {
  res.render('pacientes/agregar-paciente');
});

router.get('/pacientes', (req, res) => {
  res.render('pacientes/lista');
});

router.get('/medicos/medicos', (req, res) => {
  res.render('medicos/medicos');
});

router.get('/medicos/agregar-medico', (req, res) => {
  res.render('medicos/agregar-medico');
});

router.get('/admin', (req, res) => {
  res.render('layout'); 
});

export default router;
