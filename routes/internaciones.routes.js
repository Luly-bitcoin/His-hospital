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

router.get('/api/alas', async (req, res) => {
  try {
    const alas = await obtenerAlasConHabitacionesYCamas();
    res.json(alas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener alas' });
  }
});

router.post('/api/internar', async (req, res) => {
  const { camaId, pacienteDni, sexo } = req.body;

  try {
    // Obtener habitación de la cama
    const [[{ habitacion_id }]] = await conexion.execute(`
      SELECT habitacion_id FROM camas WHERE id = ?
    `, [camaId]);

    // Verificar si hay alguien internado en esa habitación de distinto sexo
    const [ocupantes] = await conexion.execute(`
      SELECT i.sexo
      FROM internaciones i
      JOIN camas c ON c.id = i.id_cama
      WHERE c.habitacion_id = ? AND i.fecha_egreso IS NULL
    `, [habitacion_id]);

    const conflicto = ocupantes.some(o => o.sexo !== sexo);
    if (conflicto) {
      return res.status(400).json({ error: 'Ya hay un paciente de distinto sexo en esta habitación.' });
    }

    // Insertar internación
    const fecha = new Date();
    await conexion.execute(`
      INSERT INTO internaciones (dni_pacientes, id_cama, tipo_ingreso, fecha_ingreso, sexo)
      VALUES (?, ?, 'normal', ?, ?)
    `, [pacienteDni, camaId, fecha, sexo]);

    res.json({ mensaje: 'Paciente internado correctamente.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al internar al paciente.' });
  }
});


router.get('/api/camas', async (req, res) => {
  const { habitacionId } = req.query;
  if (!habitacionId) return res.status(400).json({ error: 'Falta el ID de habitación' });

  try {
    const [camas] = await conexion.execute(
      `SELECT id FROM camas WHERE habitacion_id = ?`,
      [habitacionId]
    );
    res.json(camas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener camas' });
  }
});



export default router;
