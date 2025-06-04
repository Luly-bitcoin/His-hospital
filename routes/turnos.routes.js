import express from 'express';
import { obtenerTurnos, agendarTurno } from '../controllers/turnos.controllers.js';
import { obtenerTodosLosMedicos } from '../models/medicos.js';
import { insertarTurno } from '../models/turnos.js';
import { obtenerPacientesDisponibles } from '../models/paciente.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const turnos = await obtenerTurnos();
    const medicos = await obtenerTodosLosMedicos(); 
    const pacientes = await obtenerPacientesDisponibles();

    res.render('turnos', { turnos, medicos, pacientes });
  } catch (error) {
    console.error('Error al cargar turnos:', error);
    res.status(500).send('Error al cargar turnos');
  }
});

router.post('/agendar', async (req, res) => {
  const {
    dni_paciente,
    nombre_paciente,
    obra_social,
    telefono_contacto,
    fecha_turno,
    hora_turno,
    especialidad,
    motivo,
    tipo_turno,
    estado,
    dni_medico
  } = req.body;

  try {
    await insertarTurno(
      dni_paciente,
      nombre_paciente,
      obra_social,
      telefono_contacto,
      fecha_turno,
      hora_turno,
      especialidad,
      motivo,
      tipo_turno,
      estado,
      dni_medico
    );

    const turnos = await obtenerTurnos();
    const medicos = await obtenerTodosLosMedicos();
    const pacientes = await obtenerPacientesDisponibles();

    res.render('turnos', { turnos, medicos, pacientes, mensaje: 'Turno agendado correctamente' });
  } catch (err) {
    console.error('Error al guardar el turno:', err);
    res.status(500).send('Error al guardar el turno: ' + err.message);
  }
});


export default router;
