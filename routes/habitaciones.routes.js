import express from 'express';
export const router = express.Router();
import {conexion} from '../config/db.js';


router.get('/api/habitaciones', async (req, res) => {
  const { alaId } = req.query;

  if (!alaId) {
    return res.status(400).json({ error: 'Falta el ID del ala' });
  }

  try {
    const [habitaciones] = await conexion.execute(
      'SELECT id, CONCAT("Habitación ", id) AS nombre FROM habitaciones WHERE ala_id = ?',
      [alaId]
    );
    res.json(habitaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener habitaciones' });
  }
});

