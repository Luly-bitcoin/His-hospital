const express = require("express");
const router = express.Router();

// Vista principal de médicos
router.get("/medicos", (req, res) => res.render("medicos/medicos"));

// Vista para agregar médico
router.get("/medicos/agregar-medico", (req, res) => res.render("medicos/agregar-medico"));

// Obtener médicos en formato JSON
router.get("/medicos-json", async (req, res) => {
  try {
    const [medicos] = await conexion.execute(`
      SELECT dni, nombre, correo, sexo, matricula, especialidad
      FROM medicos
      WHERE estado = 1
    `);
    res.json(medicos);
  } catch (err) {
    console.error("Error al obtener médicos:", err);
    res.status(500).json({ mensaje: "Error al obtener médicos" });
  }
});

// Vista para editar médico
router.get('/medicos/editar/:dni', (req, res) => {
  res.render('medicos/editar-medico');
});

module.exports = router;
