// routes/internaciones.routes.js
import express from 'express';
import { conexion } from '../config/db.js';
import { obtenerAlasConHabitacionesYCamas } from '../models/camas.js';

const router = express.Router();

// Página para asignar cama
router.get('/asignar-cama', async (req, res) => {
  const { dni, nombre, sexo } = req.query;

  try {
    const alas = await obtenerAlasConHabitacionesYCamas();
    res.render('asignar-cama', { dniPaciente: dni, nombre, sexoPaciente: sexo, alas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno');
  }
});

// Asignar cama (guardar en base de datos)
router.post('/asignar', async (req, res) => {
  const { pacienteId, camaId, tipo_ingreso, fecha_ingreso, ala, habitacion, sexo } = req.body;

  if (!pacienteId || !camaId || !tipo_ingreso || !fecha_ingreso || !ala || !habitacion || !sexo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Validar que la cama no esté ocupada
    const [result] = await conexion.query(
      'SELECT * FROM asignaciones WHERE cama_id = ? AND fecha_egreso IS NULL', 
      [camaId]
    );

    if (result.length > 0) {
      return res.status(400).json({ error: 'La cama ya está ocupada' });
    }

    // Insertar asignación
    await conexion.query(
      'INSERT INTO asignaciones (paciente_id, cama_id, tipo_ingreso, fecha_ingreso, ala_id, habitacion_id, sexo) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [pacienteId, camaId, tipo_ingreso, fecha_ingreso, ala, habitacion, sexo]
    );

    res.json({ mensaje: 'Cama asignada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar asignación' });
  }
});
// en internaciones.routes.js (o en otro archivo de rutas si prefieres)

router.get('/api/alas', async (req, res) => {
  try {
    const alas = await obtenerAlasConHabitacionesYCamas();
    res.json(alas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener alas' });
  }
});

router.get('/api/habitaciones', async (req, res) => {
  const { alaId } = req.query;
  if (!alaId) return res.status(400).json({ error: 'Falta parámetro alaId' });

  try {
    const [habitaciones] = await pool.query(
      'SELECT id, capacidad FROM habitaciones WHERE ala_id = ? ORDER BY id',
      [alaId]
    );

    // Para cada habitación, cargar camas
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

    res.json(habitaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener habitaciones' });
  }
});


router.get('/api/camas', async (req, res) => {
  const { habitacionId } = req.query;
  if (!habitacionId) return res.status(400).json({ error: 'Falta parámetro habitacionId' });

  try {
    const alas = await obtenerAlasConHabitacionesYCamas();

    // Buscar la habitación en todas las alas
    let camas = [];
    for (const ala of alas) {
      const habitacion = (ala.habitaciones || []).find(h => h.id === Number(habitacionId));

      if (habitacion) {
        camas = habitacion.camas || [];
        break;
      }
    }

    if (!camas.length) return res.status(404).json({ error: 'Habitación no encontrada o sin camas' });

    res.json(camas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener camas' });
  }
});



export default router;
