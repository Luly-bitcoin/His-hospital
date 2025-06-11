
import sequelize from '../config/db.js';

export async function obtenerTodosLosMedicos() {
  const [rows] = await sequelize.query('SELECT dni, nombre FROM medicos');
  return rows;
}
