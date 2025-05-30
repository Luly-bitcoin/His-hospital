let camaSeleccionada = null;

document.querySelectorAll('.cama-libre').forEach(cama => {
  cama.addEventListener('click', () => {
    document.querySelectorAll('.cama-libre').forEach(c => c.classList.remove('seleccionada'));
    cama.classList.add('seleccionada');

    camaSeleccionada = cama.dataset.id;
  });
});

document.getElementById('btnAsignarPaciente').addEventListener('click', async () => {
  const dniPaciente = document.getElementById('dniPaciente').value;

  if (!camaSeleccionada || !dniPaciente) {
    alert('Seleccione un paciente y una cama');
    return;
  }

  const response = await fetch('/asignar-cama', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dni: dniPaciente,
      idCama: camaSeleccionada,
      tipoIngreso: 'normal', 
      sexo: '', 
    }),
  });

  const result = await response.json();
  if (response.ok) {
    alert('Paciente asignado correctamente');
    location.reload();
  } else {
    alert('Error al asignar paciente: ' + result.mensaje);
  }
});
