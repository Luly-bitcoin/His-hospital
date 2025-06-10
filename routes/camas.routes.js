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
router.get('/asignar-paciente', async (req, res) => {
  try {
    // Traer alas
    const [alas] = await conexion.query(`SELECT id, nombre FROM alas ORDER BY nombre`);

    // Todos los pacientes
    const [todosPacientes] = await conexion.query(`SELECT dni, nombre FROM pacientes ORDER BY nombre`);

    // Pacientes con internación activa
    const [pacientesConInternacion] = await conexion.query(`
      SELECT paciente_id FROM internaciones WHERE fecha_egreso IS NULL
    `);

    // Crear un Set de DNI de pacientes internados
    const pacientesInternadosSet = new Set(pacientesConInternacion.map(p => p.paciente_id));

    // Filtrar pacientes disponibles (no internados)
    const pacientes = todosPacientes.filter(p => !pacientesInternadosSet.has(p.dni));

    res.render('asignar-paciente', { alas, pacientes });
  } catch (error) {
    console.error(error);
    res.render('asignar-paciente', { alas: [], pacientes: [], error: 'Error al cargar datos' });
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

router.get('/api/camas/:id', async (req, res) => {
  const habitacionId = req.params.id;

  try {
    const [camas] = await conexion.query(`
      SELECT 
        c.id,
        c.estado,
        p.sexo AS sexo_paciente
      FROM camas c
      LEFT JOIN internaciones i ON c.id = i.id_cama AND i.fecha_egreso IS NULL
      LEFT JOIN pacientes p ON i.paciente_id = p.dni
      WHERE c.habitacion_id = ?
      ORDER BY c.id;
    `, [habitacionId]);

    res.json(camas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener camas' });
  }
});



export default router;
