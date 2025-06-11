import sequelize from '../config/db.js';

// Obtener todos los turnos con nombre del médico y paciente
export async function obtenerTodosLosTurnos() {
  const [rows] = await sequelize.query(
    `SELECT t.dni_paciente, p.nombre_completo AS pacientes, m.nombre AS medicos,
            t.fecha_turno, t.hora_turno, t.estado, t.motivo
     FROM turnos t
     JOIN pacientes p ON t.dni_paciente = p.dni
     JOIN medicos m ON t.dni_medico = m.dni
     ORDER BY t.fecha_turno, t.hora_turno`
  );
  return rows;
}

export async function insertarTurno(
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
  
) {
  const [result] = await sequelize.query(
    `INSERT INTO turnos 
  (dni_paciente, nombre_paciente, obra_social, telefono_contacto, fecha_turno, hora_turno, especialidad, motivo, tipo_turno, estado, dni_medico)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
    [dni_paciente, nombre_paciente, obra_social, telefono_contacto, fecha_turno, hora_turno, especialidad, motivo, tipo_turno, estado, dni_medico, ]
  );
  return result;
}
