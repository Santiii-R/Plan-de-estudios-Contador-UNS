
let materias = [];
let aprobadas = new Set(JSON.parse(localStorage.getItem('materiasAprobadas') || '[]'));

function agruparMateriasPorCuatrimestre(materias) {
  const grupos = {};
  materias.forEach(m => {
    const key = (m.anio || '?') + "° año - " + (m.cuatrimestre || '?') + " cuatrimestre";
    if (!grupos[key]) grupos[key] = [];
    grupos[key].push(m);
  });
  return grupos;
}

function cargarMaterias() {
  fetch('materias.json')
    .then(res => res.json())
    .then(data => {
      materias = data;
      mostrarMaterias();
    });
}

function mostrarMaterias() {
  const contenedor = document.getElementById('contenedor');
  const contador = document.getElementById('contador');
  contenedor.innerHTML = '';
  const grupos = agruparMateriasPorCuatrimestre(materias);

  let total = materias.length;
  let hechas = 0;

  for (const cuatri in grupos) {
    const bloque = document.createElement('div');
    bloque.className = 'cuatrimestre';
    bloque.innerHTML = `<h2>${cuatri}</h2><div class="lista-materias"></div>`;
    const lista = bloque.querySelector('.lista-materias');

    grupos[cuatri].forEach(materia => {
      const div = document.createElement('div');
      div.classList.add('materia');
      div.textContent = materia.nombre;
      div.dataset.nombre = materia.nombre;

      const tieneTodas = materia.correlativas.every(c => aprobadas.has(c));
      if (!tieneTodas) {
        div.classList.add('bloqueada');
      }

      if (aprobadas.has(materia.nombre)) {
        div.classList.remove('bloqueada');
        div.classList.add('aprobada');
        hechas++;
      }

      div.onclick = () => {
        if (div.classList.contains('bloqueada')) return;

        if (aprobadas.has(materia.nombre)) {
          aprobadas.delete(materia.nombre);
        } else {
          aprobadas.add(materia.nombre);
        }

        localStorage.setItem('materiasAprobadas', JSON.stringify([...aprobadas]));
        mostrarMaterias();
      };

      lista.appendChild(div);
    });

    contenedor.appendChild(bloque);
  }

  const porcentaje = ((hechas / total) * 100).toFixed(1);
  contador.innerText = `Aprobadas: ${hechas} / ${total} (${porcentaje}%)`;
  const barra = document.getElementById('relleno-progreso');
if (barra) barra.style.width = `${porcentaje}%`;
}

function limpiar() {
  localStorage.removeItem('materiasAprobadas');
  aprobadas.clear();
  mostrarMaterias();
}

cargarMaterias();
