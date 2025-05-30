import { conexion as pool } from '../config/db.js';


export async function obtenerAlasConHabitacionesYCamas() {
  const [alas] = await pool.query('SELECT id, nombre FROM alas ORDER BY nombre');

  for (const ala of alas) {
const [habitaciones] = await pool.query(
  'SELECT id, capacidad FROM habitaciones WHERE ala_id = ? ORDER BY id',
  [ala.id]
);


    for (const hab of habitaciones) {
      const [camas] = await pool.query(`
        SELECT 
          c.id,
          CASE
            WHEN i.id IS NOT NULL AND i.fecha_egreso IS NULL THEN 'ocupada'
            WHEN c.estado = 'higienizando' THEN 'higienizando'
            ELSE 'libre'
          END AS estado
        FROM camas c
        LEFT JOIN internaciones i ON c.id = i.id_cama AND i.fecha_egreso IS NULL
        WHERE c.habitacion_id = ?
        ORDER BY c.id
      `, [hab.id]);

      hab.camas = camas;
    }

    ala.habitaciones = habitaciones;
  }

  return alas;
}
