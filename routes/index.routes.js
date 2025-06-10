import express from 'express';
const router = express.Router();
import {requireLogin, permitirRoles} from '../middlewares/auth.middleware.js';

router.get('/', requireLogin, permitirRoles('admisión', 'limpieza', 'medico'), (req, res) => { 
  res.render('index', {user: req.user});
});
router.get('/login', (req, res)=>{
  res.render('login');
});

router.get('/agregar-paciente', permitirRoles('admisión'), (req, res) => { 
  res.render('agregar-paciente');
});

router.get('/camas', permitirRoles('limpieza', 'admisión'), (req, res) => {
  res.render('camas');
});

router.get('/medicos', permitirRoles('medico'), (req, res) => {
  res.render('medicos');
});
router.get('/agregar-medico', permitirRoles('medico'), (req, res) => {
  res.render('agregar-medico');
});
router.get('/editar-medico', permitirRoles('medico'), (req, res) => {
  res.render('editar-medico');
});
router.get('/lista', permitirRoles('medico'), (req, res) => {
  res.render('lista');
});
router.get('/enfermeria', permitirRoles('medico'), (req, res) => {
  res.render('enfermeria');
});

export default router;
