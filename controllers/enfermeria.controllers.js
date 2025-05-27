const enfermeriaController = {
  getEvaluacion: (req, res) => {
    res.render('enfermeria');
  },

  postEvaluacion: (req, res) => {
    const datos = req.body;
    console.log('Datos recibidos de enfermería:', datos);
    res.send('Evaluación guardada correctamente. <a href="/enfermeria">Volver</a>');
  }
};

export default enfermeriaController;
