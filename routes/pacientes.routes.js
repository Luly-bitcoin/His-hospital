import {conexion} from "../config/db.js";
import express from "express";
import {
  verificarDNI,
  agregarPaciente,
  listar
} from "../controllers/pacientes.controllers.js";
import { obtenerPacientesDisponibles } from "../controllers/pacientes.controllers.js";


const router = express.Router();
 
// Vistas
router.get("/agregar-paciente", (req, res) => {
  res.render("pacientes/agregar-paciente");
});

router.get("/lista", (req, res) => {
  res.render("pacientes/lista");
});


router.get('/disponibles', async (req, res) => {
  try {
    const pacientes = await obtenerPacientesDisponibles();
    res.status(200).json(pacientes);
  } catch (err) {
    console.error('Error en la ruta /disponibles:', err);
    res.status(500).json({ mensaje: 'Error al obtener pacientes disponibles' });
  }
});

//router.get("/:dni", async (req, res) => {
//  const dni = req.params.dni;
//  try {
//    const [rows] = await conexion.execute(
//      `SELECT dni, nombre, obra_social, telefono_contacto FROM pacientes WHERE dni = ?`,
//      [dni]
//    );
//    if (rows.length === 0) {
//      return res.status(404).json({ message: "Paciente no encontrado" });
//    }
//    res.json(rows[0]);
//  } catch (error) {
//    console.error("Error al obtener paciente:", error);
//    res.status(500).json({ message: "Error interno del servidor" });
//  }
//});

router.get('/:dni', async (req, res) => {
  const dni = req.params.dni;
  try {
    const [rows] = await conexion.execute('SELECT dni, nombre_completo, obra_social, telefono FROM pacientes WHERE dni = ?', [dni]);
    if (rows.length === 0) return res.status(404).json({ message: 'Paciente no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


router.get("/verificar-dni/:dni", verificarDNI);
router.post("/agregar", agregarPaciente);

router.get("/", listar);

export default router;
