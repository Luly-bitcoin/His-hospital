import express from 'express';
import { guardarEvaluacion } from '../controllers/enfermeria.controllers.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('enfermeria');
});

router.get('/medicos/verificar-dni/:dni', async (req, res) => {
  const dni = req.params.dni;
  console.log("DNI recibido: ",dni);
  try {
    const [result] = await pool.query('SELECT * FROM medicos WHERE dni = ?', [dni]);
    if (result.length === 0) {
      return res.json({ existe: false });
    }

    res.json({ existe: true, medico: result[0] });
  } catch (error) {
    console.error("Error al buscar médico:", error);
    res.status(500).json({ error: "Error al buscar médico" });
  }
});

router.post('/evaluacion', guardarEvaluacion);

export default router;
