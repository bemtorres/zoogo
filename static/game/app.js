// Datos del juego
let sesionActiva = false;
let animalesDB = [];
let mapa = null;

// Hábitats reales de los animales (latitud, longitud)
const habitatsAnimales = {
    'León': [0.5, 36],      // Kenia
    'Elefante': [-3, 38],    // África central
    'Tigre': [27, 84],       // Nepal
    'Jirafa': [-2, 35],      // Tanzania
    'Oso': [65, 180],        // Alaska
    'Mono': [-1, 118],       // Borneo
    'Cebra': [-2, 35],       // Tanzania
    'Hipopótamo': [-1, 30],  // Uganda
    'Panda': [31, 104],      // China
    'Lobo': [65, -155]       // Canadá
};

// Items del mercado
const itemsMercado = [
    { nombre: "Cámara Mejorada", precio: 200, efecto: "Obtienes +20% puntos por captura", emoji: "📷" },
    { nombre: "Búsqueda Avanzada", precio: 300, efecto: "Más animales aparecen", emoji: "🔍" },
    { nombre: "Booster de XP", precio: 150, efecto: "Obtienes +50% experiencia", emoji: "⚡" },
    { nombre: "Trampa Dorada", precio: 500, efecto: "Capturas raras valen x2", emoji: "🎯" }
];

// Obtener token CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

// Inicializar mapa al cargar
document.addEventListener('DOMContentLoaded', () => {
    inicializarMapa();
    cargarEstadisticas();
});

// Inicializar mapa Leaflet
function inicializarMapa() {
    mapa = L.map('mapa').setView([20, 0], 2);
    
    // Agregar capa de tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(mapa);
}

// Cargar estadísticas del servidor
function cargarEstadisticas() {
    fetch('/api/estadisticas/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('puntos').textContent = data.puntos;
            document.getElementById('experiencia').textContent = data.experiencia;
            document.getElementById('nivel').textContent = `Nivel ${data.nivel}`;
            
            const barraExp = ((data.experiencia / (data.nivel * 100)) * 100);
            document.getElementById('barra-experiencia').style.width = barraExp + '%';
            
            // Actualizar lista de animales
            const lista = document.getElementById('animales-capturados');
            if (data.animales.length === 0) {
                lista.innerHTML = '<p class="text-gray-600">Ningún animal capturado aún</p>';
            } else {
                let html = '';
                data.animales.forEach(animal => {
                    html += `
                        <div class="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span>${animal.emoji} ${animal.nombre}</span>
                            <span class="text-sm text-gray-600">${animal.cantidad}x</span>
                        </div>
                    `;
                });
                lista.innerHTML = html;
            }
        });
}

// Función para iniciar búsqueda
function iniciarSesion() {
    if (!sesionActiva) {
        sesionActiva = true;
        const btn = document.getElementById('btn-iniciar');
        btn.textContent = '🛑 Detener Búsqueda';
        btn.classList.remove('bg-green-600', 'hover:bg-green-700');
        btn.classList.add('bg-red-600', 'hover:bg-red-700');
        generarAnimal();
    } else {
        sesionActiva = false;
        const btn = document.getElementById('btn-iniciar');
        btn.textContent = '🚀 Buscar Animales';
        btn.classList.remove('bg-red-600', 'hover:bg-red-700');
        btn.classList.add('bg-green-600', 'hover:bg-green-700');
    }
}

// Generar animal aleatorio en el mapa
function generarAnimal() {
    if (!sesionActiva) return;

    // Simular generación de animal aleatorio
    const animales = ['León', 'Elefante', 'Tigre', 'Jirafa', 'Oso', 'Mono', 'Cebra', 'Hipopótamo', 'Panda', 'Lobo'];
    const emojis = ['🦁', '🐘', '🐅', '🦒', '🐻', '🐵', '🦓', '🦛', '🐼', '🐺'];
    
    const randomIndex = Math.floor(Math.random() * animales.length);
    const nombreAnimal = animales[randomIndex];
    const emojiAnimal = emojis[randomIndex];
    
    // Obtener la posición del hábitat del animal
    const posicionHabitat = habitatsAnimales[nombreAnimal];
    
    // Crear marcador en el mapa
    const marker = L.marker(posicionHabitat).addTo(mapa);
    
    // Agregar popup con el emoji
    marker.bindPopup(`
        <div style="text-align: center; font-size: 48px;">
            ${emojiAnimal}
            <br>
            <strong>${nombreAnimal}</strong>
            <br>
            <button onclick="capturarAnimalMapa('${nombreAnimal}', ${posicionHabitat[0]}, ${posicionHabitat[1]}, '${emojiAnimal}')" 
                    style="background: #16a34a; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                🎯 Capturar
            </button>
        </div>
    `);
    
    // Abrir popup automáticamente
    marker.openPopup();
    
    // Guardar información en el marcador
    marker.nombreAnimal = nombreAnimal;
    marker.emojiAnimal = emojiAnimal;
    marker.indice = randomIndex;
    
    // Remover después de 5 segundos si no se captura
    setTimeout(() => {
        mapa.removeLayer(marker);
    }, 5000);
    
    // Generar siguiente animal
    setTimeout(() => generarAnimal(), 3000);
}

// Capturar animal desde el mapa
function capturarAnimalMapa(nombreAnimal, lat, lon, emojiAnimal) {
    // Buscar el ID del animal en la base de datos
    // Por ahora usamos el índice aleatorio + 1
    const animales = ['León', 'Elefante', 'Tigre', 'Jirafa', 'Oso', 'Mono', 'Cebra', 'Hipopótamo', 'Panda', 'Lobo'];
    const animalId = animales.indexOf(nombreAnimal) + 1;
    
    // Enviar al servidor
    fetch('/api/capturar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            animal_id: animalId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Sonido de captura (visual)
            mostrarEfectoMapa(+lat, +lon, data.animal.puntos);
            
            // Actualizar UI
            document.getElementById('puntos').textContent = data.puntos;
            document.getElementById('experiencia').textContent = data.experiencia;
            document.getElementById('nivel').textContent = `Nivel ${data.nivel}`;
            
            const barraExp = ((data.experiencia / (data.nivel * 100)) * 100);
            document.getElementById('barra-experiencia').style.width = barraExp + '%';
            
            if (data.nivel_subido) {
                alert(`🎉 ¡Subiste de nivel! Ahora eres nivel ${data.nivel}`);
            }
            
            // Mostrar información del animal
            mostrarInfoAnimal(data.animal);
            
            // Recargar estadísticas
            cargarEstadisticas();
            
            // Remover todos los marcadores actuales
            mapa.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    mapa.removeLayer(layer);
                }
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al capturar el animal');
    });
}

// Mostrar efecto de puntos en el mapa
function mostrarEfectoMapa(lat, lon, valor) {
    const efecto = L.popup()
        .setLatLng([lat, lon])
        .setContent(`<div style="font-size: 24px; font-weight: bold; color: #16a34a; text-align: center;">+${valor} puntos! 🎉</div>`)
        .openOn(mapa);
    
    setTimeout(() => {
        mapa.closePopup();
    }, 2000);
}

// Mostrar información del animal
function mostrarInfoAnimal(animal) {
    const modal = document.getElementById('modal-animal');
    const contenido = document.getElementById('contenido-modal');
    
    contenido.innerHTML = `
        <div class="text-8xl mb-4">${animal.emoji}</div>
        <h3 class="text-2xl font-bold mb-2">${animal.nombre}</h3>
        <p class="text-gray-600 mb-3">${animal.descripcion}</p>
        <div class="bg-gray-100 p-3 rounded mb-2">
            <strong>Hábitat:</strong> ${animal.habitat}
        </div>
        <div class="bg-yellow-100 p-3 rounded">
            <strong>💡 Dato curioso:</strong> ${animal.dato_curioso}
        </div>
    `;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modal-animal').classList.add('hidden');
    document.getElementById('modal-animal').classList.remove('flex');
}

// Abrir mercado
function abrirMercado() {
    cargarEstadisticas().then(() => {
        const modal = document.getElementById('modal-mercado');
        const items = document.getElementById('items-mercado');
        
        const puntos = parseInt(document.getElementById('puntos').textContent);
        
        let html = '';
        itemsMercado.forEach(item => {
            const puedeComprar = puntos >= item.precio;
            html += `
                <div class="border-2 ${puedeComprar ? 'border-green-500' : 'border-gray-300'} rounded-lg p-4 bg-gray-50">
                    <div class="text-4xl mb-2">${item.emoji}</div>
                    <h3 class="font-bold text-gray-800">${item.nombre}</h3>
                    <p class="text-sm text-gray-600 mb-2">${item.efecto}</p>
                    <p class="font-bold text-lg ${puedeComprar ? 'text-green-600' : 'text-gray-400'}">
                        Precio: ${item.precio} puntos
                    </p>
                    ${puedeComprar 
                        ? `<button onclick="comprarItem(${itemsMercado.indexOf(item)})" class="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Comprar</button>`
                        : '<button disabled class="mt-2 w-full bg-gray-300 text-gray-500 py-2 rounded cursor-not-allowed">Insuficientes puntos</button>'
                    }
                </div>
            `;
        });
        
        items.innerHTML = html;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });
}

// Comprar item
function comprarItem(index) {
    const item = itemsMercado[index];
    
    fetch('/api/comprar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            item_nombre: item.nombre,
            costo: item.precio
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            cargarEstadisticas();
            alert(`✅ Compraste: ${item.nombre}\n${item.efecto}`);
            abrirMercado(); // Refrescar mercado
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al comprar el item');
    });
}

// Cerrar mercado
function cerrarMercado() {
    document.getElementById('modal-mercado').classList.add('hidden');
    document.getElementById('modal-mercado').classList.remove('flex');
}

// Mostrar ayuda
function mostrarAyuda() {
    alert(`🎮 CÓMO JUGAR

1. Haz clic en "Buscar Animales" para iniciar la búsqueda
2. Haz clic en los animales que aparezcan para capturarlos
3. Cada animal te da puntos y experiencia
4. Acumula experiencia para subir de nivel
5. Visita el mercado para mejorar tus capacidades
6. Aprende sobre los animales que captures

¡Tu progreso se guarda automáticamente! 🍀`);
}

// Cerrar modales al hacer clic fuera
document.addEventListener('click', (e) => {
    if (e.target.id === 'modal-animal' || e.target.id === 'modal-mercado') {
        cerrarModal();
        cerrarMercado();
    }
});

