import sequelize from '../config/db.js';

const emergenciasController = {
  getIngresoEmergencia: (req, res) => {
    res.render('emergencias');
    console.log('Entrando aqui');
  },
  

  getCamasEmergencias: async (req, res) => {
    try {
      const [camas] = await sequelize.query(`
        SELECT c.id
        FROM camas c
        JOIN habitaciones h ON c.habitacion_id = h.id
        JOIN alas a ON h.ala_id = a.id
        WHERE a.nombre = 'Emergencias' AND c.estado = 'libre'
      `);

      res.json(camas);
    } catch (error) {
      console.error('Error al obtener camas de emergencia:', error);
      res.status(500).json({ message: 'Error al obtener camas de emergencia' });
    }
  },

 postRegistrarEmergencia: async (req, res) => {
  const { dni, nombre, sexo, observacion, hora, cama_id } = req.body;

  console.log('Datos recibidos:', { dni, nombre, sexo, observacion, hora, cama_id });

  if (!dni || !nombre || !sexo || !hora || !cama_id) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    const fecha_ingreso = new Date(hora).toISOString().slice(0, 19).replace('T', ' ');
    console.log('Fecha ingreso formateada:', fecha_ingreso);

    const [result] = await sequelize.query(
      `INSERT INTO emergencias (dni_falso, id_cama, fecha_ingreso, sexo, observacion) VALUES (?, ?, ?, ?, ?)`,
      [dni, cama_id, fecha_ingreso, sexo, observacion]
    );
    console.log('Resultado inserción emergencias:', result);

    const [updateResult] = await sequelize.query(`UPDATE camas SET estado = 'ocupada' WHERE id = ?`, [cama_id]);
    console.log('Resultado actualización cama:', updateResult);

    res.json({ message: 'Emergencia registrada correctamente' });
  } catch (err) {
    console.error('ERROR completo:', err);
    console.error('ERROR tipo: ', typeof err);
    if(err && err.sqlMessage){
      console.error('SQL MESSAGE: ', err.sqlMessage);
    }
    // Enviar TODO el error para que puedas verlo en la respuesta del cliente
    res.status(500).json({ message: err.sqlMessage || err.message || JSON.stringify(err) });
  }
}


};

export default emergenciasController;
