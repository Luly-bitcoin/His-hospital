import express from 'express';
import { conexion } from '../config/db.js';


const router = express.Router();

router.post('/asignar-paciente', async (req, res) => {
  const { Idcama, pacienteId } = req.body;
  if (!Idcama || !pacienteId) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    // Validar que no haya otra asignación activa
    const [existente] = await conexion.query(`
      SELECT id FROM internaciones
      WHERE id_cama = ? AND fecha_egreso IS NULL
    `, [Idcama]);

    if (existente.length > 0) {
      return res.status(400).json({ message: 'La cama ya está ocupada' });
    }

    const fechaAsignacion = new Date();

    await conexion.query(`
      INSERT INTO internaciones (paciente_id, id_cama, fecha_asignacion)
      VALUES (?, ?, ?)
    `, [pacienteId, Idcama, fechaAsignacion]);

    res.status(200).json({ message: 'Paciente asignado correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al asignar paciente' });
  }
});

function agruparCamas(camas) {
  const alas = [];

  camas.forEach(cama => {
    let ala = alas.find(a => a.numero === cama.ala);
    if (!ala) {
      ala = { numero: cama.ala, habitaciones: [] };
      alas.push(ala);
    }

    let habitacion = ala.habitaciones.find(h => h.numero === cama.habitacion);
    if (!habitacion) {
      habitacion = { numero: cama.habitacion, camas: [] };
      ala.habitaciones.push(habitacion);
    }

    habitacion.camas.push(cama);
  });

  return alas;
}


router.get('/camas', async (req, res) => {
  try {
    const [camas] = await createPool.query(`
  SELECT
    c.id AS id_cama,
    c.id AS numero, -- cambiamos c.numero por c.id
    h.ala_id AS ala,
    h.id AS habitacion,
    CASE
      WHEN i.id IS NOT NULL AND i.fecha_egreso IS NULL THEN 'ocupada'
      WHEN c.estado = 'higienizando' THEN 'higienizando'
      ELSE 'libre'
    END AS estado
  FROM camas c
  JOIN habitaciones h ON c.habitacion_id = h.id
  LEFT JOIN internaciones i 
    ON c.id = i.id_cama AND i.fecha_egreso IS NULL
  ORDER BY ala, habitacion, c.id;
`);

      res.render('camas', [camas]);
  } catch (err) {
    console.error(err);
    res.render('camas', {camas: [], error: 'Error al cargar las camas'});
  }
});


export default router;
