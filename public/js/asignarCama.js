document.addEventListener('DOMContentLoaded', () => {
  const selectAla = document.getElementById('selectAla');
  const selectHabitacion = document.getElementById('selectHabitacion');

  selectAla.addEventListener('change', () => {
    const alaId = selectAla.value;
    if (!alaId) {
      selectHabitacion.innerHTML = '<option value="">Seleccionar habitación</option>';
      return;
    }

    // Llamar a la API para traer las habitaciones del ala seleccionada
    fetch(`/api/habitaciones?alaId=${alaId}`)
      .then(response => {
        if (!response.ok) throw new Error('Error al obtener habitaciones');
        return response.json();
      })
      .then(habitaciones => {
        // Limpiar y llenar el select de habitaciones
        selectHabitacion.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccionar habitación';
        selectHabitacion.appendChild(defaultOption);

        habitaciones.forEach(habitacion => {
          const option = document.createElement('option');
          option.value = habitacion.id;
          option.textContent = `Habitación ${habitacion.id} (Capacidad: ${habitacion.capacidad})`;
          selectHabitacion.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error al cargar habitaciones:', error);
        alert('Ocurrió un error al cargar habitaciones.');
      });
  });
});
