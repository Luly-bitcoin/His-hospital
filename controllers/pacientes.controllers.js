import { conexion } from "../config/db.js";

// Renderiza la vista de pacientes con todos los registros
export const listar = async (req, res) => {
  try {
    const [rows] = await conexion.execute('SELECT * FROM pacientes');
    res.render('pacientes/lista', { pacientes: rows });
  } catch (error) {
    console.error(error);
    res.send('Error cargando pacientes');
  }
};

// API: Verificar si existe un paciente por DNI
export const verificarDNI = async (req, res) => {
  try {
    const dni = req.params.dni;
    const [results] = await conexion.execute(
      'SELECT * FROM pacientes WHERE dni = ?', 
      [dni]
    );
    res.json({ existe: results.length > 0, paciente: results[0] || null });
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// API: Insertar nuevo paciente
export const agregarPaciente = async (req, res) => {
  const { dni, nombre, fecha, direcc, contacto, sexo, derivado, telefono } = req.body;

  let sexoFormateado;
  if (sexo === 'masculino') sexoFormateado = 'M';
  else if (sexo === 'femenino') sexoFormateado = 'F';
  else return res.status(400).json({ mensaje: "Sexo inválido" });

  if (!dni || !nombre || !fecha || !direcc || !contacto || !telefono) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  try {
    const sql = `
      INSERT INTO pacientes 
      (dni, nombre_completo, fecha_nacimiento, direccion, contacto_emergencia, sexo, derivado, telefono) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    await conexion.execute(sql, [
      dni, nombre, fecha, direcc, contacto, sexoFormateado, derivado ? 1 : 0, telefono
    ]);

    res.status(200).json({ mensaje: 'Paciente guardado correctamente' });
  } catch (err) {
    console.error('Error al guardar el paciente:', err);
    res.status(500).json({ mensaje: 'Error al guardar el paciente' });
  }
};

// API: Obtener pacientes disponibles para asignar a cama
export const listarPacientes = async (req, res) => {
  try {
    const [pacientes] = await conexion.execute(
      'SELECT dni, nombre_completo FROM pacientes WHERE id_cama IS NULL'
    );
    res.status(200).json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener pacientes' });
  }
};
