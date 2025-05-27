// db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Usamos createPool en lugar de createConnection para mejor gestión de conexiones
const conexion = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'his_hospital',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("Conectado a la base de datos MySQL");

export {conexion};
