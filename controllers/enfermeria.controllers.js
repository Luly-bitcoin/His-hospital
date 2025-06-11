import sequelize from '../config/db.js';

export const guardarEvaluacion = async (req, res) => {
  const {
    dni_paciente,
    dni_medico,
    enfermedades_previas,
    cirugias_previas,
    alergias,
    medicamentos_actuales,
    antecedentes_familiares,
    motivo,
    sintomas,
    presion_arterial,
    frecuencia_cardiaca,
    frecuencia_respiratoria,
    temperatura,
    observaciones_generales,
    observaciones,
    intervenciones,
    medicamentos,
    comunicacion
  } = req.body;

  // Validaciones básicas
  if (!dni_paciente || !dni_medico) {
    return res.status(400).json({ error: "Faltan DNI del paciente o médico" });
  }

  if (temperatura !== null && (isNaN(temperatura) || temperatura < 30 || temperatura > 45)) {
    return res.status(400).json({ error: "Temperatura corporal inválida" });
  }

  if (frecuencia_cardiaca !== null && (frecuencia_cardiaca < 20 || frecuencia_cardiaca > 250)) {
    return res.status(400).json({ error: "Frecuencia cardíaca fuera de rango" });
  }

  if (frecuencia_respiratoria !== null && (frecuencia_respiratoria < 5 || frecuencia_respiratoria > 60)) {
    return res.status(400).json({ error: "Frecuencia respiratoria fuera de rango" });
  }

  try {
    const [evaluacion] = await sequelize.execute(`
      INSERT INTO evaluaciones_enfermeria (dni_paciente, dni_medico)
      VALUES (?, ?)`,
      [dni_paciente, dni_medico]
    );
    const evaluacionId = evaluacion.insertId;

    await sequelize.execute(`
      INSERT INTO historial_medico
      (evaluacion_id, enfermedades_previas, cirugias_previas, alergias, medicamentos_actuales, antecedentes_familiares)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [evaluacionId, enfermedades_previas, cirugias_previas, alergias, medicamentos_actuales, antecedentes_familiares]
    );

    await sequelize.execute(`
      INSERT INTO motivo_internacion
      (evaluacion_id, motivo, sintomas)
      VALUES (?, ?, ?)`,
      [evaluacionId, motivo, sintomas]
    );

    await sequelize.execute(`
      INSERT INTO signos_vitales
      (evaluacion_id, presion_arterial, frecuencia_cardiaca, frecuencia_respiratoria, temperatura, observaciones)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [evaluacionId, presion_arterial, frecuencia_cardiaca, frecuencia_respiratoria, temperatura, observaciones_generales]
    );

    await sequelize.execute(`
      INSERT INTO observaciones_generales
      (evaluacion_id, observaciones)
      VALUES (?, ?)`,
      [evaluacionId, observaciones]
    );

    await sequelize.execute(`
      INSERT INTO plan_cuidados
      (evaluacion_id, intervenciones, medicamentos, comunicacion)
      VALUES (?, ?, ?, ?)`,
      [evaluacionId, intervenciones, medicamentos, comunicacion]
    );

    res.status(201).json({ mensaje: "Evaluación guardada correctamente" });
  } catch (error) {
    console.error("Error al guardar evaluación:", error);
    res.status(500).json({ error: "Error interno al guardar evaluación" });
  }
};
