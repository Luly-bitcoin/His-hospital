
const express = require('express');
const router = express.Router();
const notificacionesModel = require('../models/notificaciones');

// Middleware para verificar rol y usuario (asumo que tienes uno)
function checkRole(roles) {
  return (req, res, next) => {
    if (roles.includes(req.session.user.rol)) next();
    else res.status(403).send('No autorizado');
  };
}

// Administración crea notificación para limpieza
router.post('/enviar', checkRole(['administracion']), async (req, res) => {
  const { mensaje, id_cama, para_usuario } = req.body;
  const de_usuario = req.session.user.id; // o nombre, lo que uses
  try {
    await notificacionesModel.crearNotificacion(mensaje, id_cama, de_usuario, para_usuario);
    res.json({ ok: true, msg: 'Notificación enviada' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al enviar notificación' });
  }
});

// Limpieza obtiene notificaciones pendientes
router.get('/pendientes', checkRole(['limpieza']), async (req, res) => {
  const para_usuario = req.session.user.id;
  try {
    const notis = await notificacionesModel.listarNotificaciones(para_usuario);
    res.json(notis);
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener notificaciones' });
  }
});

// Limpieza responde a una notificación
router.post('/responder', checkRole(['limpieza']), async (req, res) => {
  const { id_notificacion, respuesta } = req.body;
  try {
    await notificacionesModel.responderNotificacion(id_notificacion, respuesta);
    res.json({ ok: true, msg: 'Notificación respondida' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al responder notificación' });
  }
});

module.exports = router;
