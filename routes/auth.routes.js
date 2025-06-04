import express from 'express';
import {
  mostrarLogin,
  login,
  mostrarRegistro,
  registrar,
  logout
} from '../controllers/auth.controllers.js';

const router = express.Router();

router.get('/login', mostrarLogin);
router.post('/login', login);
router.get('/registrar', mostrarRegistro);
router.post('/registrar', registrar);
router.get('/logout', logout);

export default router;
