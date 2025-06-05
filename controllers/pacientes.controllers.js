import { conexion } from "../config/db.js";

export const listar = async (req, res) => {
  try {
    const [rows] = await conexion.execute('SELECT * FROM pacientes');
    res.render('pacientes/lista', { pacientes: rows });
  } catch (error) {
    console.error(error);
    res.send('Error cargando pacientes');
  }
};

export const verificarDNI = async (req, res) => {
  try {
    const dni = req.params.dni;
    console.log("DNI recibido para verificar:", dni); 
    
    const [results] = await conexion.execute(
      'SELECT * FROM pacientes WHERE dni = ?', 
      [dni]
    );

    console.log("Resultados de la consulta:", results); 
    
    if(results.length === 0) {
      return res.status(404).json({ existe: false, paciente: null });
    }
    
    res.json({ existe: true, paciente: results[0] });
  } catch (error) {
    console.error('Error en la consulta al verificar DNI:', error);
    res.status(500).json({ error: 'Error al verificar al paciente' });
  }
};


export const agregarPaciente = async (req, res) => {
  console.log('Datos recibidos: ', req.body);
  const { dni, nombre, fecha, direcc, contacto, sexo, derivado, telefono, localidad, obraSocial } = req.body;

  let sexoFormateado;
  if (sexo === 'masculino') sexoFormateado = 'M';
  else if (sexo === 'femenino') sexoFormateado = 'F';
  else return res.status(400).json({ mensaje: "Sexo inválido" });

  if (!dni || !nombre || !fecha || !direcc || !contacto || !telefono || !localidad || !obraSocial) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  try {
    const sql = `
      INSERT INTO pacientes 
      (dni, nombre_completo, fecha_nacimiento, direccion, contacto_emergencia, sexo, derivado, telefono, localidad, obra_social) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await conexion.execute(sql, [
      dni, nombre, fecha, direcc, contacto, sexoFormateado, derivado ? 1 : 0, telefono, localidad, obraSocial
    ]);

    res.status(200).json({ mensaje: 'Paciente guardado correctamente' });
  } catch (err) {
    console.error('Error al guardar el paciente:', err);
    res.status(500).json({ mensaje: 'Error al guardar el paciente' });
  }
};

export const listarPacientes = async (req, res) => {
  try {
    const [pacientes] = await conexion.execute(
      'SELECT dni, nombre_completo FROM pacientes'
    );
    res.status(200).json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener pacientes' });
  }
};

export async function obtenerPacientesDisponibles() {
  try {
    const [pacientes] = await conexion.execute(`
      SELECT dni, nombre_completo 
      FROM pacientes 
      WHERE dni NOT IN (
        SELECT dni_pacientes FROM internaciones
      )
    `);
    return pacientes;
  } catch (error) {
    console.error('Error al obtener pacientes disponibles:', error);
    return [];
  }
}

export const obtenerPacientesInternados = async (req, res) => {
  try {
    const [pacientes] = await conexion.execute(`
      SELECT p.nombre_completo, i.dni_pacientes AS dni, i.cama_id, i.fecha_asignacion
      FROM internaciones i
      JOIN pacientes p ON p.dni = i.dni_pacientes
      WHERE i.fecha_alta IS NULL OR i.fecha_alta > NOW()
    `);
    res.status(200).json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes internados:', error);
    res.status(500).json({ mensaje: 'Error al obtener pacientes internados' });
  }
};
