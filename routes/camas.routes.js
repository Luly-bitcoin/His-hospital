import express from 'express';

const router = express.Router();

router.post('/asignar-paciente', (req, res) => {
  const { camaId, pacienteId } = req.body;
  if (!camaId || !pacienteId) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  res.status(200).json({ message: 'Paciente asignado correctamente' });
});

export default router;
