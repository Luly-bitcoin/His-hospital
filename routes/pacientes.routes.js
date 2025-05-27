import express from "express";
import {
  verificarDNI,
  agregarPaciente,
  listarPacientes,
  listar
} from "../controllers/pacientes.controllers.js";

const router = express.Router();

// Vistas
router.get("/agregar-paciente", (req, res) => {
  res.render("pacientes/agregar-paciente");
});

router.get("/lista", (req, res) => {
  res.render("pacientes/lista");
});

// API
router.get("/verificar-dni/:dni", verificarDNI);
router.post("/agregar", agregarPaciente);
router.get("/disponibles", listarPacientes);

router.get("/", listar);

export default router;
