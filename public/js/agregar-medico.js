document.getElementById("formMedico").addEventListener("submit", async (e) => {
  e.preventDefault();

  const dni = document.getElementById("dni").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const sexo = document.getElementById("sexo").value;
  const matricula = document.getElementById("matricula").value.trim();
  const especialidad = document.getElementById("especialidad").value.trim();

  if (!dni || !nombre || !correo || !sexo || !matricula || !especialidad) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const medico = { dni, nombre, correo, sexo, matricula, especialidad };

  try {
    const res = await fetch("/api/medicos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(medico)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Médico guardado correctamente");
      window.location.href = "/medicos";
    } else {
      alert(data.message || "Error al guardar médico");
    }
  } catch (error) {
    console.error("Error al guardar médico:", error);
    alert("Error al conectar con el servidor");
  }
});
