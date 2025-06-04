import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
import {obtenerAlasConHabitacionesYCamas} from './models/camas.js';
dotenv.config();

import session from 'express-session';
const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(session({
  secret: 'un-secreto-muy-seguro', 
  resave: false,
  saveUninitialized: false,
}));
app.use((req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.routes.js';
import { obtenerPacientesDisponibles } from './controllers/pacientes.controllers.js';
import indexRoutes from './routes/index.routes.js';
import medicosRoutes from './routes/medicos.routes.js';
import camasRoutes from './routes/camas.routes.js';
import pacientesRoutes from './routes/pacientes.routes.js';
import enfermeriaRoutes from './routes/enfermeria.routes.js';
import { router as emergenciasRoutes } from './routes/emergencias.routes.js';
import turnosRoutes from './routes/turnos.routes.js';
import internacionesRoutes from './routes/internaciones.routes.js';

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', authRoutes);
app.use((req, res, next)=>{
  const publicRoutes = ['/login', '/registrar', '/css/', '/js/'];
  if(!req.session.user && !publicRoutes.some(r => req.url.startsWith(r))){
    return res.redirect('/login');
  }
  next();
});


app.use('/', indexRoutes);
app.use('/medicos', medicosRoutes);
app.use('/camas', camasRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/enfermeria', enfermeriaRoutes);
app.use('/emergencias', emergenciasRoutes);
app.use('/turnos', turnosRoutes);
app.use('/internaciones', internacionesRoutes);


app.get('/camas', async (req, res) =>{
  try{
    const {dni, nombre} = req.query;
    const alas = await obtenerAlasConHabitacionesYCamas() || [];
    res.render('camas', {
      alas, 
      pacientes: dni && nombre ? {dni, nombre} : null,
      user: req.user
    });
  }catch(error){
    console.error('Error al cargar camas', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/pacientes-disponibles', async (req, res) => {
  try {
    const pacientes = await obtenerPacientesDisponibles();
    res.status(200).json(pacientes);
  } catch (err) {
    console.error('Error en la ruta /pacientes-disponibles:', err);
    res.status(500).json({ mensaje: 'Error al obtener pacientes disponibles' });
  }
});

app.get('/asignar-cama', async (req, res) => {
  try {
    const { dni, nombre, sexo } = req.query;
    const alas = await obtenerAlasConHabitacionesYCamas() || [];
    res.render('asignar-cama', {
      alas,
      dniPaciente: dni,
      nombre,
      sexoPaciente: sexo
    });
  } catch (error) {
    console.error('Error al cargar la vista de asignar cama:', error);
    res.status(500).send('Error interno del servidor');
  }
});


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rechazo no manejado:', reason);
});


export default router;