import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importación de rutas
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

app.get('/camas', async (req, res) =>{
  const alas = await obtenerAlasConHabitacionesYCamas();
  res.render('camas',{alas: alas || []});
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

export default router;