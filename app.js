// Datos del juego
let puntos = 0;
let experiencia = 0;
let nivel = 1;
let animalesCapturados = {};
let sesionActiva = false;

// Base de datos de animales con información educativa
const animalesDB = [
    {
        nombre: "León",
        emoji: "🦁",
        puntos: 50,
        experiencia: 30,
        descripcion: "El león es el rey de la selva. Son felinos sociales que viven en manadas llamadas manadas.",
        habitat: "Sabanas africanas",
        datoCurioso: "Los leones pueden dormir hasta 20 horas al día"
    },
    {
        nombre: "Elefante",
        emoji: "🐘",
        puntos: 100,
        experiencia: 50,
        descripcion: "El elefante es el mamífero terrestre más grande del mundo.",
        habitat: "África y Asia",
        datoCurioso: "Los elefantes tienen la memoria más larga que cualquier otro animal"
    },
    {
        nombre: "Tigre",
        emoji: "🐅",
        puntos: 75,
        experiencia: 40,
        descripcion: "El tigre es el felino más grande del mundo.",
        habitat: "Ásia",
        datoCurioso: "Los tigres pueden nadar hasta 6 km de distancia"
    },
    {
        nombre: "Jirafa",
        emoji: "🦒",
        puntos: 60,
        experiencia: 35,
        descripcion: "La jirafa es el mamífero más alto del mundo.",
        habitat: "África",
        datoCurioso: "Las jirafas tienen cuellos tan largos que tienen corazones especiales para bombear sangre al cerebro"
    },
    {
        nombre: "Oso",
        emoji: "🐻",
        puntos: 80,
        experiencia: 45,
        descripcion: "Los osos son mamíferos omnívoros muy inteligentes.",
        habitat: "Varios continentes",
        datoCurioso: "Los osos pueden oler comida a kilómetros de distancia"
    },
    {
        nombre: "Mono",
        emoji: "🐵",
        puntos: 30,
        experiencia: 20,
        descripcion: "Los monos son primates muy inteligentes.",
        habitat: "África, Asia y América",
        datoCurioso: "Los chimpancés comparten el 98% de su ADN con los humanos"
    },
    {
        nombre: "Cebra",
        emoji: "🦓",
        puntos: 40,
        experiencia: 25,
        descripcion: "Las cebras son conocidas por sus rayas únicas.",
        habitat: "África",
        datoCurioso: "Cada cebra tiene un patrón de rayas único, como huellas dactilares humanas"
    },
    {
        nombre: "Hipopótamo",
        emoji: "🦛",
        puntos: 70,
        experiencia: 38,
        descripcion: "El hipopótamo es uno de los animales más agresivos del mundo.",
        habitat: "África",
        datoCurioso: "A pesar de su apariencia pesada, los hipopótamos pueden correr hasta 30 km/h"
    },
    {
        nombre: "Panda",
        emoji: "🐼",
        puntos: 90,
        experiencia: 48,
        descripcion: "El panda es un símbolo de conservación animal.",
        habitat: "China",
        datoCurioso: "Los pandas comen bambú durante 12 horas al día"
    },
    {
        nombre: "Lobo",
        emoji: "🐺",
        puntos: 65,
        experiencia: 36,
        descripcion: "Los lobos son animales sociales que viven en manadas.",
        habitat: "América del Norte, Europa, Asia",
        datoCurioso: "Los lobos pueden comunicarse mediante aullidos hasta 10 km de distancia"
    }
];

// Items del mercado
const itemsMercado = [
    { nombre: "Cámara Mejorada", precio: 200, efecto: "Obtienes +20% puntos por captura", emoji: "📷" },
    { nombre: "Búsqueda Avanzada", precio: 300, efecto: "Más animales aparecen", emoji: "🔍" },
    { nombre: "Booster de XP", precio: 150, efecto: "Obtienes +50% experiencia", emoji: "⚡" },
    { nombre: "Trampa Dorada", precio: 500, efecto: "Capturas raras valen x2", emoji: "🎯" }
];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    actualizarUI();
});

// Función para iniciar búsqueda
function iniciarSesion() {
    if (!sesionActiva) {
        sesionActiva = true;
        document.querySelector('button[onclick="iniciarSesion()"]').textContent = '🛑 Detener Búsqueda';
        document.querySelector('button[onclick="iniciarSesion()"]').classList.remove('bg-green-600');
        document.querySelector('button[onclick="iniciarSesion()"]').classList.add('bg-red-600');
        generarAnimal();
    } else {
        sesionActiva = false;
        document.querySelector('button[onclick="iniciarSesion()"]').textContent = '🚀 Buscar Animales';
        document.querySelector('button[onclick="iniciarSesion()"]').classList.remove('bg-red-600');
        document.querySelector('button[onclick="iniciarSesion()"]').classList.add('bg-green-600');
    }
}

// Generar animal aleatorio
function generarAnimal() {
    if (!sesionActiva) return;

    const mapa = document.getElementById('mapa');
    const animal = animalesDB[Math.floor(Math.random() * animalesDB.length)];
    
    const animalElement = document.createElement('div');
    animalElement.className = 'animal fade-in';
    animalElement.innerHTML = `
        <div class="text-6xl text-center" title="${animal.nombre}">
            ${animal.emoji}
        </div>
    `;
    
    // Posición aleatoria
    const maxX = mapa.offsetWidth - 80;
    const maxY = mapa.offsetHeight - 80;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    animalElement.style.left = x + 'px';
    animalElement.style.top = y + 'px';
    animalElement.style.position = 'absolute';
    
    // Agregar evento de clic
    animalElement.addEventListener('click', () => capturarAnimal(animal, animalElement));
    
    mapa.appendChild(animalElement);
    
    // Remover después de un tiempo si no se captura
    setTimeout(() => {
        if (animalElement.parentNode) {
            animalElement.style.opacity = '0';
            animalElement.style.transition = 'opacity 0.5s';
            setTimeout(() => animalElement.remove(), 500);
        }
    }, 3000);
    
    // Generar siguiente animal
    setTimeout(() => generarAnimal(), 2000);
}

// Capturar animal
function capturarAnimal(animal, elemento) {
    elemento.classList.add('animal-capturado');
    
    // Sonido de captura (visual)
    mostrarEfectoPuntos(animal.puntos, elemento);
    
    // Actualizar estadísticas
    puntos += animal.puntos;
    experiencia += animal.experiencia;
    
    // Actualizar animales capturados
    if (!animalesCapturados[animal.nombre]) {
        animalesCapturados[animal.nombre] = 0;
    }
    animalesCapturados[animal.nombre]++;
    
    // Verificar nivel
    verificarNivel();
    
    // Actualizar UI
    actualizarUI();
    
    // Mostrar información del animal
    mostrarInfoAnimal(animal);
    
    // Remover elemento
    setTimeout(() => elemento.remove(), 500);
}

// Mostrar efecto de puntos
function mostrarEfectoPuntos(valor, elemento) {
    const efecto = document.createElement('div');
    efecto.className = 'efecto-puntos';
    efecto.textContent = `+${valor} puntos!`;
    efecto.style.left = elemento.style.left;
    efecto.style.top = elemento.style.top;
    
    document.getElementById('mapa').appendChild(efecto);
    
    setTimeout(() => efecto.remove(), 1000);
}

// Verificar nivel
function verificarNivel() {
    const expNecesaria = nivel * 100;
    if (experiencia >= expNecesaria) {
        nivel++;
        experiencia = experiencia - expNecesaria;
        alert(`🎉 ¡Subiste de nivel! Ahora eres nivel ${nivel}`);
    }
}

// Actualizar UI
function actualizarUI() {
    document.getElementById('puntos').textContent = puntos;
    document.getElementById('experiencia').textContent = experiencia;
    document.getElementById('nivel').textContent = `Nivel ${nivel}`;
    
    const barraExp = ((experiencia / (nivel * 100)) * 100);
    document.getElementById('barra-experiencia').style.width = barraExp + '%';
    
    // Actualizar lista de animales capturados
    const lista = document.getElementById('animales-capturados');
    const total = Object.keys(animalesCapturados).length;
    
    if (total === 0) {
        lista.innerHTML = '<p class="text-gray-600">Ningún animal capturado aún</p>';
    } else {
        let html = '';
        for (let [nombre, cantidad] of Object.entries(animalesCapturados)) {
            const animal = animalesDB.find(a => a.nombre === nombre);
            html += `
                <div class="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>${animal.emoji} ${nombre}</span>
                    <span class="text-sm text-gray-600">${cantidad}x</span>
                </div>
            `;
        }
        lista.innerHTML = html;
    }
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
            <strong>💡 Dato curioso:</strong> ${animal.datoCurioso}
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
    const modal = document.getElementById('modal-mercado');
    const items = document.getElementById('items-mercado');
    
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
}

// Comprar item
function comprarItem(index) {
    const item = itemsMercado[index];
    if (puntos >= item.precio) {
        puntos -= item.precio;
        actualizarUI();
        alert(`✅ Compraste: ${item.nombre}\n${item.efecto}`);
        abrirMercado(); // Refrescar mercado
    }
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

¡Buena suerte! 🍀`);
}

// Cerrar modales al hacer clic fuera
document.addEventListener('click', (e) => {
    if (e.target.id === 'modal-animal' || e.target.id === 'modal-mercado') {
        cerrarModal();
        cerrarMercado();
    }
});
