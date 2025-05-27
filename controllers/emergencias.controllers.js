// Simulación de datos para camas de emergencia
const camasEmergencia = [
  { id: '1', numero: 'E1', ala: 'Norte' },
  { id: '2', numero: 'E2', ala: 'Sur' },
];

// Métodos del controlador
const emergenciasController = {
  getIngresoEmergencia: (req, res) => {
    res.render('emergencias');
  },

  getCamasEmergencias: (req, res) => {
    res.json(camasEmergencia);
  },

  postRegistrarEmergencia: (req, res) => {
    const { dni, hora, cama_id } = req.body;
    console.log('Emergencia registrada:', { dni, hora, cama_id });

    if (!dni || !hora || !cama_id) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    return res.json({ message: 'Emergencia registrada correctamente' });
  }
};

// Exportar como default
export default emergenciasController;
