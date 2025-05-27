const db = require('../config/db');

exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pacientes');
    res.render('pacientes/lista', { pacientes: rows });
  } catch (error) {
    console.error(error);
    res.send('Error cargando pacientes');
  }
};
