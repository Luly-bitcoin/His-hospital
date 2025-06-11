import './models/sync.js';
import dotenv from 'dotenv';
import express from 'express';
import sequelize from './config/db.js';
const router = express.Router();
import {obtenerAlasConHabitacionesYCamas} from './models/camas.js';
import { obtenerHabitacionesPorAla, obtenerCamasPorHabitacion } from './controllers/habitaciones.controllers.js';
dotenv.config();

const apiRouter = express.Router();
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
import emergenciasRoutes from './routes/emergencias.routes.js';
import turnosRoutes from './routes/turnos.routes.js';
import internacionesRoutes from './routes/internaciones.routes.js';
import {router as habitacionesRouter} from './routes/habitaciones.routes.js';
import asignarPacienteRoutes from './routes/asignarPaciente.routes.js';


app.use(express.json());

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
app.use('/habitaciones', habitacionesRouter);
app.use('/', asignarPacienteRoutes);

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

app.get('/pacientes-disponibles', async (req, res) => {
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
    const alas = await obtenerAlasConHabitacionesYCamas() || [];

    // Leer paciente de query string
    const { dni, nombre, sexo } = req.query;
    const pacienteSeleccionado = (dni && nombre && sexo)
      ? { dni, nombre, sexo }
      : null;

    console.log('Datos para asignar-cama:', JSON.stringify(alas, null, 2));
    console.log('Paciente seleccionado:', pacienteSeleccionado);

    res.render('asignar-cama', { alas, pacienteSeleccionado });
  } catch (error) {
    console.error('Error al cargar la vista de asignar cama:', error);
    res.status(500).send('Error interno del servidor');
  }
});


apiRouter.get('/habitaciones/:alaId', async (req, res) => {
  try {
    const alaId = req.params.alaId;
    const habitaciones = await obtenerHabitacionesPorAla(alaId);
    res.json(habitaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener habitaciones' });
  }
});

apiRouter.get('/camas/:habitacionId', async (req, res) => {
  try {
    const habitacionId = req.params.habitacionId;
    const camas = await obtenerCamasPorHabitacion(habitacionId);
    res.json(camas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener camas' });
  }
});

app.get('/api/camas/emergencias-disponibles', async (req, res) => {
  try {
    const [camas] = await sequelize.query(`
      SELECT c.id AS id, a.nombre AS alas
      FROM camas c
      JOIN habitaciones h ON c.habitacion_id = h.id
      JOIN alas a ON h.ala_id = a.id
      WHERE c.estado = 'libre' AND a.nombre = 'Emergencias'
    `);

    res.json(camas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener camas de emergencia' });
  }
});

app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true})
  .then(() =>{
    console.log('Modelos sincronizados');
    app.listen(PORT, () =>{
      console.log(`servidor iniciando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar modelos: ', err);
  });

process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rechazo no manejado:', reason);
});


export default router;