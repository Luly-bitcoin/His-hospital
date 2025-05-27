 function mostrarToast(mensaje) {
        const toast = document.getElementById("toast");
        toast.innerText = mensaje;
        toast.className = "toast show";
    
        setTimeout(() => {
          toast.className = toast.className.replace("show", "");
        }, 3000); 
      }
    
      function buscarPaciente() {
  const dni = document.getElementById("dni").value;
  if (dni !== "") {
    fetch(`http://localhost:3000/pacientes/verificar-dni/${dni}`)

      .then(response => response.json())
      .then(data => {
        if (data.existe) {
          document.getElementById("nombre_completo").disabled = true;
          mostrarToast("El paciente existe. Datos cargados.");

          const paciente = data.paciente;

          // Rellenar y deshabilitar campos
          document.getElementById("nombre_completo").value = paciente.nombre_completo || "";
          document.getElementById("nombre_completo").disabled = true;

          document.getElementById("fecha_nacimiento").value = paciente.fecha_nacimiento?.split("T")[0] || "";
          document.getElementById("fecha_nacimiento").disabled = true;

          document.getElementById("direccion").value = paciente.direccion || "";
          document.getElementById("direccion").disabled = true;

          document.getElementById("localidad").value = paciente.localidad || "";
          document.getElementById("localidad").disabled = true;

          document.getElementById("contacto_emergencia").value = paciente.contacto_emergencia || "";
          document.getElementById("contacto_emergencia").disabled = true;

          document.getElementById("sexo").value = paciente.sexo || "";
          document.getElementById("sexo").disabled = true;

          document.getElementById("telefono").value = paciente.telefono || "";
          document.getElementById("telefono").disabled = true;

          document.getElementById("obra-social").value = paciente.obraSocial || "";
          document.getElementById("obra-social").disabled = true;

          // Derivado y su campo relacionado
          if (paciente.derivado) {
            document.getElementById("derivado").checked = true;
            toggleGuardia(); // Mostrar campos adicionales si está derivado
            document.getElementById("derivado").disabled = true;
            document.getElementById("motivo").disabled = true;
            document.getElementById("tipoCama").disabled = true;
          }

          // También podrías deshabilitar el botón de "Registrar Paciente"
          document.querySelector('button[type="submit"]').disabled = true;

        } else {
          mostrarToast("El paciente no existe.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        mostrarToast("Error al verificar el paciente");
      });
  } else {
    mostrarToast("Por favor, ingrese un DNI");
  }
}

function limpiarFormulario() {
  document.querySelector("form").reset();

  const campos = [
    "dni", "nombre_completo", "fecha_nacimiento", "direccion",
    "contacto_emergencia", "sexo", "telefono", "motivo", "tipoCama"
  ];

  campos.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.disabled = false;
      campo.value = "";
    }
  });

  document.getElementById("derivado").checked = false;
  toggleGuardia(); // Oculta campos de internación si están visibles

  document.querySelector('button[type="submit"]').disabled = false;
  document.getElementById("editarBtn").style.display = "none";

  // Limpiar mensajes de error si quedaron
  document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
}


async function validarFormulario(event) {
  event.preventDefault();
  console.log("ValidarFormulario ejecutando");

  let valid = true;
  document.querySelectorAll(".error-message").forEach(el => el.textContent = "");

  // Validación de campos
  const dni = document.getElementById("dni").value.trim();
  const nombre = document.getElementById("nombre_completo").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const contacto = document.getElementById("contacto_emergencia").value.trim();
  const sexo = document.getElementById("sexo").value.trim();
  const fecha = document.getElementById("fecha_nacimiento").value;
  const direccion = document.getElementById("direccion").value.trim();
  const derivado = document.getElementById("derivado").checked;
  const localidad = document.getElementById("localidad").value.trim();
  const obraSocial = document.getElementById("obra-social").value.trim();

  // Expresiones regulares para validar
  const dniRegex = /^\d{8}$/;
  const nombreRegex = /^[a-zA-Z\s]+$/;
  const telefonoRegex = /^[\d-]{6,}$/; // acepta números y guiones, mínimo 6 caracteres

  if (!dniRegex.test(dni)) {
    document.getElementById("errorDni").textContent = "DNI inválido (8 dígitos)";
    valid = false;
  }
  if(localidad.length === 0){
    document.getElementById("errorLoc").textContent = "Localidad inválida";
    valid = false;
  }
  if(obraSocial.length === 0){
    document.getElementById("ErrorObra").textContent = "Obra social inválida";
    valid = false;
  }
  if (!nombreRegex.test(nombre)) {
    document.getElementById("errorNombre").textContent = "Nombre inválido (solo letras y espacios)";
    valid = false;
  }
  if (!telefonoRegex.test(telefono)) {
    document.getElementById("errorTelefono").textContent = "Teléfono inválido";
    valid = false;
  }
  if (contacto && !telefonoRegex.test(contacto)) {
    document.getElementById("errorContacto").textContent = "Contacto inválido";
    valid = false;
  }
  if (sexo !== "M" && sexo !== "F") {
    document.getElementById("errorSexo").textContent = "Seleccione sexo";
    valid = false;
  }
  if (!fecha) {
    alert("Por favor ingrese fecha de nacimiento");
    valid = false;
  }
  if (!direccion) {
    alert("Por favor ingrese dirección");
    valid = false;
  }

  if (!valid) return;

  // Construir el objeto a enviar
  const paciente = {
    dni: dni,
    nombre: nombre,
    fecha: fecha,
    direcc: direccion,
    contacto: contacto,
    sexo: sexo === "M" ? "masculino" : "femenino",
    derivado: derivado,
    telefono: telefono,
    localidad: localidad,
    obraSocial: obraSocial
  };

  try {
    const response = await fetch("http://localhost:3000/pacientes/agregar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paciente)
    });

    const data = await response.json();

    console.log("Respuesta del backend: ", response.status, data);

    if (response.ok) {
      mostrarToast("Paciente guardado correctamente");
      limpiarFormulario();
    } else {
      mostrarToast(data.mensaje || "Error al guardar paciente");
    }
  } catch (error) {
    console.error("Error al guardar paciente:", error);
    mostrarToast("Error al guardar paciente");
  }
}