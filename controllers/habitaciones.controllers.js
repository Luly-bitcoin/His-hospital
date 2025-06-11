import sequelize from '../config/db.js';

export async function obtenerHabitacionesPorAla(alaId) {
  const [habitaciones] = await sequelize.query(
    'SELECT id, capacidad FROM habitaciones WHERE ala_id = ? ORDER BY id',
    [alaId]
  );
  return habitaciones;
}

export async function obtenerCamasPorHabitacion(habitacionId) {
  const [camas] = await sequelize.query(`
    SELECT 
      c.id, c.estado,
      CASE
        WHEN i.id IS NOT NULL AND i.fecha_egreso IS NULL THEN 'ocupada'
        WHEN c.estado = 'higienizando' THEN 'higienizando'
        ELSE 'libre'
      END AS estado,
      -- si querés agregar sexo ocupante
      (SELECT sexo FROM internaciones i WHERE i.id_cama = c.id AND i.fecha_egreso IS NULL LIMIT 1) AS sexo_ocupante
    FROM camas c
    LEFT JOIN internaciones i ON c.id = i.id_cama AND i.fecha_egreso IS NULL
    WHERE c.habitacion_id = ?
    ORDER BY c.id
  `, [habitacionId]);
  return camas;
}
