import express from 'express';
import { conexion } from '../config/db.js'; 
import {permitirRoles, checkRole} from '../middlewares/auth.middleware.js';
import medicosControllers from '../controllers/medicos.controllers.js';

const router = express.Router();

router.get('/medico', permitirRoles, checkRole('medico'), medicosControllers.mostrarVistaMedico);
// Vista principal de médicos
router.get("/", (req, res) => res.render("medicos/medicos"));

// Vista para agregar médico
router.get("/agregar-medico", (req, res) => res.render("medicos/agregar-medico"));

// Vista para editar médico
router.get("/editar/:dni", (req, res) => res.render("medicos/editar-medico"));

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

// Obtener un médico específico (API para editar-medico.js)
router.get("/api/medicos/:dni", async (req, res) => {
  const dni = req.params.dni;
  try {
    const [rows] = await conexion.execute(`
      SELECT dni, nombre, correo, sexo, matricula, especialidad
      FROM medicos
      WHERE dni = ? AND estado = 1
    `, [dni]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener médico:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Actualizar un médico (PUT)
router.put("/api/medicos/:dni", async (req, res) => {
  const dni = req.params.dni;
  const { nombre, correo, sexo, matricula, especialidad } = req.body;

  try {
    const [resultado] = await conexion.execute(`
      UPDATE medicos
      SET nombre = ?, correo = ?, sexo = ?, matricula = ?, especialidad = ?
      WHERE dni = ? AND estado = 1
    `, [nombre, correo, sexo, matricula, especialidad, dni]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: "Médico no encontrado o sin cambios" });
    }

    res.json({ message: "Médico actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar médico:", error);
    res.status(500).json({ message: "Error interno al actualizar médico" });
  }
});

router.get("/:dni", async (req, res) => {
  const dni = req.params.dni;
  console.log("Buscando medico con dni: ", dni);
  try {
    const [rows] = await conexion.execute(`
      SELECT dni, nombre, correo, sexo, matricula, especialidad
      FROM medicos
      WHERE dni = ? 
    `, [dni]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener médico:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


export default router;
