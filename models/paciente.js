import sequelize from '../config/db.js';

export async function obtenerPacientesDisponibles() {
  try {
    const [rows] = await sequelize.query(
      `SELECT dni, nombre_completo 
       FROM pacientes 
       WHERE dni NOT IN (
       SELECT dni_pacientes FROM internaciones
       )
    `);
    return rows;
  } catch (error) {
    console.error('Error al obtener pacientes disponibles:', error);
    return [];
  }
}
