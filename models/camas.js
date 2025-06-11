import sequelize from '../config/db.js';

export async function obtenerAlasConHabitacionesYCamas() {
  const [alas] = await sequelize.query('SELECT id, nombre FROM alas ORDER BY nombre');
  console.log('Alas:', alas);

  for (const ala of alas) {
    const [habitaciones] = await sequelize.query(
      'SELECT id, capacidad FROM habitaciones WHERE ala_id = ? ORDER BY id',
      [ala.id]
    );

    console.log(`Habitaciones para ala ${ala.id}:`, habitaciones);

    for (const hab of habitaciones) {
      const [camas] = await sequelize.query(`
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
      console.log(`Camas para habitación ${hab.id}:`, camas);
      hab.camas = camas;
    }

    ala.habitaciones = habitaciones;
  }

  return alas;
}
