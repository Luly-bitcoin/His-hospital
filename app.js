import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
import {obtenerAlasConHabitacionesYCamas} from './models/camas.js';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importación de rutas
import { obtenerPacientesDisponibles } from './controllers/pacientes.controllers.js';
import indexRoutes from './routes/index.routes.js';
import medicosRoutes from './routes/medicos.routes.js';
import camasRoutes from './routes/camas.routes.js';
import pacientesRoutes from './routes/pacientes.routes.js';
import enfermeriaRoutes from './routes/enfermeria.routes.js';
import { router as emergenciasRoutes } from './routes/emergencias.routes.js';


const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configuración del motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', indexRoutes);
app.use('/', medicosRoutes);
app.use('/camas', camasRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/enfermeria', enfermeriaRoutes);
app.use('/emergencias', emergenciasRoutes);
app.use('/medicos', medicosRoutes);

app.get('/camas', async (req, res) =>{
  try{
    const {dni, nombre} = req.query;
    const alas = await obtenerAlasConHabitacionesYCamas() || [];
    res.render('camas', {
      alas, 
      pacientes: dni && nombre ? {dni, nombre} : null
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


// Iniciar servidor
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