import express from 'express';
import {checkLimpieza, confirmarLimpieza} from '../controllers/camas.controllers.js';

const router = express.Router();

router.get('/notificaciones/limpieza', checkLimpieza);
router.post('/notificaciones/limpieza/confirmar', confirmarLimpieza);

let camaSeleccionada = null;

document.querySelectorAll('.cama-libre').forEach(cama => {
  cama.addEventListener('click', () => {
    document.querySelectorAll('.cama-libre').forEach(c => c.classList.remove('seleccionada'));
    cama.classList.add('seleccionada');

    camaSeleccionada = {
      id: cama.dataset.id,
      sexo: cama.dataset.sexo,         
      ala: cama.dataset.ala,
      habitacion: cama.dataset.habitacion
    };
  });
});

document.getElementById('btnAsignarPaciente').addEventListener('click', async () => {
  const pacienteId = document.getElementById('dniPaciente').value;
  const sexo = document.getElementById('sexoPaciente').value; // ← Asegurate de tener este campo

  if (!camaSeleccionada || !pacienteId) {
    alert('Seleccione un paciente y una cama');
    return;
  }

  const fechaIngreso = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const response = await fetch('/internaciones/asignar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pacienteId,
      camaId: camaSeleccionada.id,
      tipo_ingreso: 'normal',
      fecha_ingreso: fechaIngreso,
      ala: camaSeleccionada.ala,
      habitacion: camaSeleccionada.habitacion,
      sexo: sexo
    }),
  });

  const result = await response.json();
  if (response.ok) {
    alert('Paciente asignado correctamente');
    location.reload();
  } else {
    alert('Error al asignar paciente: ' + (result.error || result.mensaje));
  }
});

export default router;