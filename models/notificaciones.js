import {conexion} from '../config/conexion.js';

async function crearNotificacion(mensaje, id_cama, de_usuario, para_usuario) {
  const [result] = await conexion.execute(
    `INSERT INTO notificaciones (mensaje, estado, id_cama, de_usuario, para_usuario, fecha_creacion)
     VALUES (?, 'pendiente', ?, ?, ?, NOW())`,
    [mensaje, id_cama, de_usuario, para_usuario]
  );
  return result.insertId;
}

// Listar notificaciones para un usuario
async function listarNotificaciones(usuario) {
  const [rows] = await conexion.execute(
    `SELECT * FROM notificaciones WHERE para_usuario = ? AND estado = 'pendiente' ORDER BY fecha_creacion DESC`,
    [usuario]
  );
  return rows;
}

// Actualizar notificación (ej. marcar como completada y agregar respuesta)
async function responderNotificacion(id, respuesta) {
  const [result] = await conexion.execute(
    `UPDATE notificaciones SET estado = 'completada', respuesta = ?, fecha_respuesta = NOW() WHERE id = ?`,
    [respuesta, id]
  );
  return result.affectedRows;
}

module.exports = {
  crearNotificacion,
  listarNotificaciones,
  responderNotificacion
};