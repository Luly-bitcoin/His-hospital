import express from 'express';
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

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración del motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', indexRoutes);
app.use('/medicos', medicosRoutes);
app.use('/camas', camasRoutes);
app.use('/pacientes', pacientesRoutes);

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
