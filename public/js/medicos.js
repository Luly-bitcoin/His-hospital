let medicosOriginales = [];

// Cargar médicos al iniciar
fetch("/medicos-json")
  .then(res => res.json())
  .then(medicos => {
    medicosOriginales = medicos;
    mostrarMedicos(medicos);
  });

function mostrarMedicos(medicos) {
  const tbody = document.getElementById("tabla-medicos");
  tbody.innerHTML = "";

  medicos.forEach(medico => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${medico.nombre}</td>
      <td>${medico.correo}</td>
      <td>${medico.sexo}</td>
      <td>${medico.matricula}</td>
      <td>${medico.dni}</td>
      <td>${medico.especialidad}</td>
      <td class="acciones">
        <button class="editar" onclick="editar('${medico.dni}')">Editar</button>
        <button class="borrar" onclick="eliminar(${medico.dni})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

function filtrarMedicos() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const filtrados = medicosOriginales.filter(medico =>
    medico.nombre.toLowerCase().includes(texto) ||
    medico.dni.toString().includes(texto) ||
    medico.correo.toLowerCase().includes(texto) ||
    medico.matricula.toLowerCase().includes(texto) ||
    medico.sexo.toLowerCase().includes(texto) ||
    medico.especialidad.toLowerCase().includes(texto)
  );
  mostrarMedicos(filtrados);
}

function eliminar(dni) {
  if (confirm("¿Seguro que deseas eliminar este médico?")) {
    fetch(`/api/medicos/${dni}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    })
    .catch(err => {
      alert("Error al eliminar médico");
      console.error(err);
    });
  }
}

function editar(dni) {
  window.location.href = `/medicos/editar/${dni}`;
}
