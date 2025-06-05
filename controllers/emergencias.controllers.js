import {conexion} from '../config/db.js'; // Asegurate de tener esta conexión configurada

const emergenciasController = {
  getIngresoEmergencia: (req, res) => {
    res.render('emergencias');
  },

  getCamasEmergencias: async (req, res) => {
    try {
      const [camas] = await conexion.query(`
        SELECT c.id, c.numero, a.nombre AS ala
        FROM camas c
        JOIN habitaciones h ON c.habitacion_id = h.id
        JOIN alas a ON h.ala_id = a.id
        WHERE a.id = 7 AND c.estado = 'libre'
      `);

      res.json(camas);
    } catch (error) {
      console.error('Error al obtener camas de emergencia:', error);
      res.status(500).json({ message: 'Error al obtener camas de emergencia' });
    }
  },

  postRegistrarEmergencia: async (req, res) => {
    const { dni, hora, cama_id } = req.body;

    if (!dni || !hora || !cama_id) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
      // Insertar el paciente en tabla pacientes (si querés crear entrada)
      await conexion.query(
        `INSERT INTO pacientes (dni, nombre, sexo, observaciones, emergencia) VALUES (?, ?, ?, ?, ?)`,
        [dni, 'NN', 'No especificado', 'Paciente ingresado sin datos por emergencia.', 1]
      );

      // Registrar internación/emergencia
      await conexion.query(
        `INSERT INTO internaciones (paciente_dni, cama_id, fecha_ingreso) VALUES (?, ?, ?)`,
        [dni, cama_id, hora]
      );

      // Cambiar estado de la cama
      await conexion.query(`UPDATE camas SET estado = 'ocupada' WHERE id = ?`, [cama_id]);

      res.json({ message: 'Emergencia registrada correctamente' });
    } catch (err) {
      console.error('Error al registrar emergencia:', err);
      res.status(500).json({ message: 'Error al registrar emergencia' });
    }
  }
};

export default emergenciasController;
