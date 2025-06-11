import express from 'express';
import sequelize from '../config/db.js';

const router = express.Router();

router.post('/asignar-paciente', async (req, res) => {
  const { dni_pacientes, id_cama, tipo_ingreso, sexo } = req.body;

  const fecha_ingreso = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    await sequelize.query(
      `INSERT INTO internaciones (dni_pacientes, id_cama, tipo_ingreso, fecha_ingreso, sexo)
       VALUES (?, ?, ?, ?, ?)`,
      [dni_pacientes, id_cama, tipo_ingreso, fecha_ingreso, sexo]
    );
    res.send('Paciente asignado correctamente');
  } catch (error) {
    console.error('Error al guardar internación:', error);
    res.status(500).send('Error al asignar paciente.');
  }
});

export default router;
