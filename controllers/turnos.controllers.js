// controllers/turnos.controllers.js
import { obtenerTodosLosTurnos, insertarTurno } from '../models/turnos.js';

export async function obtenerTurnos() {
  return await obtenerTodosLosTurnos();
}

export async function agendarTurno(dni, medico, fecha_turno, hora_turno) {
  return await insertarTurno(dni, medico, fecha_turno, hora_turno);
}
