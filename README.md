# 🦁 Cazador de Animales - Aplicación Django

Una aplicación web educativa e interactiva para aprender sobre el mundo de los animales, desarrollada con Django, HTML, CSS y JavaScript usando Tailwind CSS.

## 🎮 Características

- **Sistema de Autenticación**: Login y registro de usuarios
- **Mapa Interactivo**: Captura animales que aparecen aleatoriamente
- **Progreso Persistente**: Tus puntos, nivel y capturas se guardan en la base de datos
- **10 Animales Diferentes**: Cada uno con información educativa
- **Sistema de Niveles**: Sube de nivel acumulando experiencia
- **Mercado**: Canjea puntos por mejoras
- **Estadísticas**: Registra todos los animales capturados
- **Dashboard Personal**: Cada usuario tiene su propio progreso

## 📋 Requisitos

- Python 3.8 o superior
- pip (instalador de paquetes de Python)
- Navegador web moderno

## 🚀 Instalación

### Opción 1: Instalación Rápida

```bash
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Migrar base de datos
python manage.py makemigrations
python manage.py migrate

# 3. (Opcional) Crear superusuario para admin
python manage.py createsuperuser

# 4. Ejecutar servidor
python manage.py runserver
```

### Opción 2: Paso a Paso Detallado

Ver el archivo `INSTRUCCIONES_INSTALACION.txt` para instrucciones completas.

## 🎯 Uso

1. Abre tu navegador y ve a: http://127.0.0.1:8000/
2. Crea una cuenta o inicia sesión
3. Haz clic en "Buscar Animales" para comenzar
4. Haz clic en los animales para capturarlos
5. Aprende sobre cada animal que captures
6. Visita el mercado para mejorar

## 📁 Estructura del Proyecto

```
programa ingenieria/
├── cazador_animales/      # Configuración del proyecto Django
│   ├── settings.py        # Configuración
│   ├── urls.py           # URLs principales
│   └── ...
├── game/                  # Aplicación del juego
│   ├── models.py         # Modelos: PlayerProfile, Animal, etc.
│   ├── views.py          # Vistas y lógica del juego
│   ├── urls.py           # URLs de la app
│   ├── admin.py          # Panel de administración
│   ├── signals.py        # Señales para crear perfiles
│   └── templates/game/   # Plantillas HTML
│       ├── login.html
│       ├── register.html
│       └── index.html
├── static/game/          # Archivos estáticos
│   ├── styles.css        # Estilos CSS
│   └── app.js           # Lógica JavaScript
├── manage.py             # Script de gestión
├── requirements.txt      # Dependencias Python
└── db.sqlite3            # Base de datos (se crea automáticamente)
```

## 🐾 Animales Disponibles

- 🦁 León (50 pts, 30 xp)
- 🐘 Elefante (100 pts, 50 xp)
- 🐅 Tigre (75 pts, 40 xp)
- 🦒 Jirafa (60 pts, 35 xp)
- 🐻 Oso (80 pts, 45 xp)
- 🐵 Mono (30 pts, 20 xp)
- 🦓 Cebra (40 pts, 25 xp)
- 🦛 Hipopótamo (70 pts, 38 xp)
- 🐼 Panda (90 pts, 48 xp)
- 🐺 Lobo (65 pts, 36 xp)

Cada animal incluye información educativa sobre su hábitat y comportamiento.

## 📊 Base de Datos

El proyecto usa SQLite y contiene las siguientes tablas:

- **PlayerProfile**: Progreso del jugador (puntos, experiencia, nivel)
- **Animal**: Información de los animales del juego
- **AnimalCapturado**: Registro de animales capturados por cada jugador
- **Compra**: Historial de compras en el mercado

## 🛒 Mercado

El mercado ofrece mejoras:
- 📷 Cámara Mejorada (200 pts)
- 🔍 Búsqueda Avanzada (300 pts)
- ⚡ Booster de XP (150 pts)
- 🎯 Trampa Dorada (500 pts)

## 🛠️ Tecnologías

- **Django 4.2**: Framework web
- **Python**: Lenguaje de programación
- **SQLite**: Base de datos
- **HTML5/CSS3**: Estructura y estilos
- **JavaScript**: Interactividad
- **Tailwind CSS**: Framework de utilidades (via CDN)

## 🎨 Características Interactivas

- Animaciones al aparecer y capturar animales
- Efectos visuales de puntos ganados
- Barras de progreso de experiencia
- Modales informativos
- Sistema de compras en el mercado
- Guardado automático de progreso

## 🔐 Autenticación

Los usuarios deben:
1. Registrarse con un nombre de usuario y contraseña
2. Iniciar sesión para acceder al juego
3. Su progreso se guarda automáticamente en la base de datos

## 📝 Panel de Administración

Accede al panel de administración en: http://127.0.0.1:8000/admin/

Desde allí puedes:
- Ver y editar usuarios
- Gestionar animales
- Revisar estadísticas de jugadores
- Ver historial de capturas y compras

## 🎓 Objetivo Educativo

Esta aplicación está diseñada para ayudar a aprender sobre el mundo animal de manera divertida e interactiva, mientras se desarrollan habilidades de programación web con Django.

## 📚 API Endpoints

- `POST /api/capturar/` - Capturar un animal
- `GET /api/estadisticas/` - Obtener estadísticas del jugador
- `POST /api/comprar/` - Comprar items del mercado

## 🐛 Solución de Problemas

### Error: "No module named 'django'"
```bash
pip install -r requirements.txt
```

### Error: "No migrations to apply"
```bash
python manage.py makemigrations game
python manage.py migrate
```

### Problemas con archivos estáticos
Verifica que `settings.py` tiene `STATICFILES_DIRS` configurado correctamente.

## 📄 Licencia

Este proyecto es educativo y fue desarrollado para fines de aprendizaje.

## 👨‍💻 Desarrollo

Para contribuir o modificar el proyecto:

1. Instala las dependencias
2. Crea una rama para tus cambios
3. Realiza las modificaciones
4. Prueba el código
5. Haz commit de los cambios

## 🌟 Características Adicionales

- El progreso se guarda automáticamente en cada captura
- Sistema de niveles dinámico basado en experiencia
- Información educativa sobre cada animal
- Historial completo de capturas
- Interfaz responsive y moderna

¡Disfruta capturando animales y aprendiendo sobre la naturaleza! 🎉
