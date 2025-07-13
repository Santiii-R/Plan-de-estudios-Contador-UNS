
let materias = [];
let aprobadas = new Set(JSON.parse(localStorage.getItem('materiasAprobadas') || '[]'));

function cargarMaterias() {
  fetch('materias.json')
    .then(res => res.json())
    .then(data => {
      materias = data;
      mostrarMaterias();
    });
}

function mostrarMaterias() {
  const contenedor = document.getElementById('materias-container');
  contenedor.innerHTML = '';

  materias.forEach(materia => {
    const div = document.createElement('div');
    div.classList.add('materia');
    div.dataset.codigo = materia.codigo;

    if (aprobadas.has(materia.nombre)) {
      div.classList.add('aprobada');
    } else if (materia.correlativas.every(c => aprobadas.has(c))) {
      div.classList.add('habilitada');
    }

    div.innerHTML = `
      <h3>${materia.nombre}</h3>
      <p><strong>Año:</strong> ${materia.anio || '-'} | <strong>Cuatrimestre:</strong> ${materia.cuatrimestre || '-'}</p>
      <p><strong>Correlativas:</strong> ${materia.correlativas.length > 0 ? materia.correlativas.join(', ') : 'Ninguna'}</p>
    `;

    div.onclick = () => {
      if (aprobadas.has(materia.nombre)) {
        aprobadas.delete(materia.nombre);
      } else {
        aprobadas.add(materia.nombre);
      }
      localStorage.setItem('materiasAprobadas', JSON.stringify([...aprobadas]));
      mostrarMaterias();
    };

    contenedor.appendChild(div);
  });
}

function limpiarAprobadas() {
  localStorage.removeItem('materiasAprobadas');
  aprobadas.clear();
  mostrarMaterias();
}

cargarMaterias();
