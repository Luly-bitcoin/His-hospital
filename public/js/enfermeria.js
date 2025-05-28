document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("form");
  if (formulario) {
    formulario.addEventListener("submit", guardarEvaluacion);
  }
});

async function guardarEvaluacion(event) {
  event.preventDefault();

  const frecuencia_cardiaca_input = document.querySelector('[name="frecuencia_cardiaca"]');
  const frecuencia_cardiaca = frecuencia_cardiaca_input ? parseInt(frecuencia_cardiaca_input.value.trim()) || null : null;

  const datos = {
    dni_paciente: document.getElementById("dni").value.trim(),
    dni_medico: document.getElementById("dni_medico").value.trim(),
    medico_nombre: document.getElementById("medico_nombre").value.trim(),
    medico_matricula: document.getElementById("medico_matricula").value.trim(),  // corregido paréntesis

    enfermedades_previas: document.querySelector('[name="enfermedades_previas"]')?.value || "",
    cirugias_previas: document.querySelector('[name="cirugias_previas"]')?.value || "",
    alergias: document.querySelector('[name="alergias"]')?.value || "",
    medicamentos_actuales: document.querySelector('[name="medicamentos_actuales"]')?.value || "",
    antecedentes_familiares: document.querySelector('[name="antecedentes_familiares"]')?.value || "",

    motivo: document.querySelector('[name="motivo"]')?.value || "",
    sintomas: document.querySelector('[name="sintomas"]')?.value || "",

    presion_arterial: document.querySelector('[name="presion_arterial"]')?.value || "",

    frecuencia_cardiaca: frecuencia_cardiaca,

    frecuencia_respiratoria: (() => {
        const val = document.querySelector('[name="frecuencia_respiratoria"]')?.value.trim();
        return val === "" ? null : parseInt(val);
    })(),

    temperatura: (() => {
        const val = document.querySelector('[name="temperatura"]')?.value.trim();
        return val === "" ? null : parseFloat(val);
    })(),
    observaciones_generales: document.querySelector('[name="observaciones_generales"]')?.value || "",

    observaciones: document.querySelector('[name="observaciones"]')?.value || "",
    intervenciones: document.querySelector('[name="intervenciones"]')?.value || "",
    medicamentos: document.querySelector('[name="medicamentos"]')?.value || "",
    comunicacion: document.querySelector('[name="comunicacion"]')?.value || "",
  };

  // Validación básica
  if (!datos.dni_medico || !datos.medico_nombre || !datos.medico_matricula) {
    alert("Por favor complete todos los datos del médico antes de guardar.");
    return;
  }

  try {
    const res = await fetch('/enfermeria/evaluacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const resultado = await res.json();

    if (!res.ok) throw new Error(resultado.error);
    alert("Evaluación guardada correctamente");

  } catch (err) {
    alert("ups " + err.message);
  }
}