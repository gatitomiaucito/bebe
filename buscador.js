/* ==========================================================
   BUSCADOR
   Filtra las tarjetas (.card) por título y descripción mientras
   escribes. Ignora mayúsculas y acentos ("cancion" encuentra "canción").
   ========================================================== */
(function () {
    'use strict';

    const form = document.getElementById('buscador-form');
    const input = document.getElementById('buscador-input');
    const btnLimpiar = document.getElementById('buscador-limpiar');
    const estado = document.getElementById('buscador-estado');
    if (!form || !input) return;

    // Quita acentos y pasa a minúsculas
    const normalizar = (texto) =>
        texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

    // Tarjetas con su texto ya normalizado (título + descripción)
    const tarjetas = Array.from(document.querySelectorAll('.card')).map((el) => {
        const titulo = el.querySelector('h3');
        const desc = el.querySelector('p');
        return {
            el,
            texto: normalizar((titulo ? titulo.textContent : '') + ' ' + (desc ? desc.textContent : ''))
        };
    });

    // Secciones que contienen tarjetas (para mostrar un aviso si quedan vacías)
    const secciones = ['recuerdos', 'canciones']
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    function filtrar() {
        const consulta = normalizar(input.value);
        const palabras = consulta.split(/\s+/).filter(Boolean);
        let total = 0;

        tarjetas.forEach(({ el, texto }) => {
            const coincide = palabras.every((p) => texto.includes(p));
            el.classList.toggle('oculto', !coincide);
            // Si la tarjeta aún tenía la animación pendiente, la mostramos
            if (coincide) el.classList.add('visible');
            if (coincide) total++;
        });

        // Oculta secciones sin resultados solo cuando se está buscando
        secciones.forEach((sec) => {
            const hay = sec.querySelector('.card:not(.oculto)');
            sec.classList.toggle('oculto', palabras.length > 0 && !hay);
        });

        btnLimpiar.hidden = input.value === '';

        if (!palabras.length) {
            estado.textContent = '';
            estado.classList.remove('buscador__estado--vacio');
        } else if (total === 0) {
            estado.textContent = 'No encontré nada con “' + input.value.trim() + '”. Prueba con otra palabra.';
            estado.classList.add('buscador__estado--vacio');
        } else {
            estado.textContent = total === 1 ? '1 resultado' : total + ' resultados';
            estado.classList.remove('buscador__estado--vacio');
        }
    }

    function limpiar() {
        input.value = '';
        filtrar();
        input.focus();
    }

    input.addEventListener('input', filtrar);
    btnLimpiar.addEventListener('click', limpiar);

    // Enter: lleva a la primera tarjeta encontrada
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const primera = document.querySelector('.card:not(.oculto)');
        if (input.value.trim() && primera) {
            primera.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Esc: borra la búsqueda
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && input.value) {
            e.preventDefault();
            limpiar();
        }
    });
})();
