router.get('/api/habitaciones', async (req, res) => {
  const { alaId } = req.query;
  if (!alaId) return res.status(400).json({ error: 'Falta alaId' });

  try {
    const [habitaciones] = await conexion.execute(
      'SELECT id FROM habitaciones WHERE ala_id = ?',
      [alaId]
    );
    res.json(habitaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener habitaciones' });
  }
});
