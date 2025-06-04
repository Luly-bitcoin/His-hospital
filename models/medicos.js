// models/medicos.js
import {conexion} from '../config/db.js';

export async function obtenerTodosLosMedicos() {
  const [rows] = await conexion.query('SELECT dni, nombre FROM medicos');
  return rows;
}
