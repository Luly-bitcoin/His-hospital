import express from 'express';
import { conexion } from '../config/db.js';
import { actualizarEstadoCama } from '../controllers/camas.controllers.js';

const router = express.Router();

router.post('/camas/limpiar/:id', async (req, res) => {
  const idCama = req.params.id;
  const { nuevoEstado } = req.body;

  if (nuevoEstado !== 'libre') return res.status(400).send('Estado inválido');

  try {
    await actualizarEstadoCama(idCama, nuevoEstado);
    res.status(200).send('Estado actualizado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

router.post('/asignar-paciente', async (req, res) => {
  const { Idcama, pacienteId } = req.body;
  if (!Idcama || !pacienteId) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    const [existente] = await conexion.query(`
      SELECT id FROM internaciones WHERE id_cama = ? AND fecha_egreso IS NULL
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
    const [camas] = await conexion.query(`
      SELECT
        c.id AS id_cama,
        c.id AS numero,
        h.ala_id AS ala,
        h.id AS habitacion,
        CASE
          WHEN i.id IS NOT NULL AND i.fecha_egreso IS NULL THEN 'ocupada'
          WHEN c.estado = 'higienizando' THEN 'higienizando'
          ELSE 'libre'
        END AS estado
      FROM camas c
      JOIN habitaciones h ON c.habitacion_id = h.id
      LEFT JOIN internaciones i ON c.id = i.id_cama AND i.fecha_egreso IS NULL
      ORDER BY ala, habitacion, c.id;
    `);

    const alas = agruparCamas(camas);

    res.render('camas', { alas, user: req.user });
  } catch (err) {
    console.error(err);
    res.render('camas', { alas: [], error: 'Error al cargar las camas' });
  }
});

export default router;
