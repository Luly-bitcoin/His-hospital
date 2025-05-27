import express from 'express';
import { conexion } from '../config/db.js';


const router = express.Router();

router.get('/', (req, res) => {
  res.render('camas');
});

router.post('/asignar-paciente', async (req, res) => {
  const { camaId, pacienteId } = req.body;
  if (!camaId || !pacienteId) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    // Validar que no haya otra asignación activa
    const [existente] = await conexion.query(`
      SELECT id FROM asignaciones_camas 
      WHERE cama_id = ? AND fecha_alta IS NULL
    `, [camaId]);

    if (existente.length > 0) {
      return res.status(400).json({ message: 'La cama ya está ocupada' });
    }

    const fechaAsignacion = new Date();

    await conexion.query(`
      INSERT INTO asignaciones_camas (paciente_id, cama_id, fecha_asignacion)
      VALUES (?, ?, ?)
    `, [pacienteId, camaId, fechaAsignacion]);

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


router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT
        c.id AS cama_id,
        c.numero,
        h.ala_id AS ala,
        h.id AS habitacion,
        CASE
          WHEN ac.id IS NOT NULL AND ac.fecha_alta IS NULL THEN 'ocupada'
          WHEN c.estado = 'higienizando' THEN 'higienizando'
          ELSE 'libre'
        END AS estado_final
      FROM camas c
      JOIN habitaciones h ON c.habitacion_id = h.id
      LEFT JOIN asignaciones_camas ac 
        ON c.id = ac.cama_id AND ac.fecha_alta IS NULL
      ORDER BY ala, habitacion, c.numero;
    `;
    const [camas] = await conexion.query(query);
    res.render('camas', { camas }); // ya las mandas a la vista
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar las camas');
  }
});


export default router;
