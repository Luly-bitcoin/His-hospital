import {conexion} from "../config/db.js";
import express from "express";
import {
  verificarDNI,
  agregarPaciente,
  listarPacientes,
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


router.get('/pacientes-disponibles', async (req, res) => {
  try {
    const pacientes = await obtenerPacientesDisponibles();
    res.status(200).json(pacientes);
  } catch (err) {
    console.error('Error en la ruta /pacientes-disponibles:', err);
    res.status(500).json({ mensaje: 'Error al obtener pacientes disponibles' });
  }
});


router.get("/verificar-dni/:dni", verificarDNI);
router.post("/agregar", agregarPaciente);
router.get("/disponibles", listarPacientes);

router.get("/", listar);

export default router;
