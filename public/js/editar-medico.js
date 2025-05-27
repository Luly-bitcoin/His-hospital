// Obtener el DNI desde la URL
const partes = window.location.pathname.split('/');
const dni = partes[partes.length - 1];

if (!dni) {
  alert('No se indicó el DNI del médico');
  window.location.href = '/medicos';
}

// Cargar datos del médico
async function cargarMedico() {
  try {
    const res = await fetch(`/api/medicos/${dni}`);
    if (!res.ok) throw new Error('Médico no encontrado');
    const medico = await res.json();

    document.getElementById('dni').value = medico.dni;
    document.getElementById('nombre').value = medico.nombre;
    document.getElementById('correo').value = medico.correo;
    document.getElementById('sexo').value = medico.sexo;
    document.getElementById('matricula').value = medico.matricula;
    document.getElementById('especialidad').value = medico.especialidad;
  } catch (err) {
    alert('Error al cargar médico: ' + err.message);
    window.location.href = '/medicos';
  }
}

cargarMedico();

// Enviar actualización
document.getElementById('formEditarMedico').addEventListener('submit', async (e) => {
  e.preventDefault();

  const medicoActualizado = {
    nombre: document.getElementById('nombre').value.trim(),
    correo: document.getElementById('correo').value.trim(),
    sexo: document.getElementById('sexo').value,
    matricula: document.getElementById('matricula').value.trim(),
    especialidad: document.getElementById('especialidad').value.trim(),
  };

  try {
    const res = await fetch(`/api/medicos/${dni}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicoActualizado),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Error al actualizar');
    }

    alert('Médico actualizado correctamente');
    window.location.href = '/medicos';
  } catch (err) {
    alert('Error al actualizar: ' + err.message);
  }
});
