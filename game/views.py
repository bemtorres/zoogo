from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
from .models import PlayerProfile, Animal, AnimalCapturado, Compra


def login_view(request):
    """Vista de inicio de sesión"""
    if request.user.is_authenticated:
        return redirect('index')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            messages.success(request, f'¡Bienvenido, {username}!')
            return redirect('index')
        else:
            messages.error(request, 'Usuario o contraseña incorrectos')
    
    return render(request, 'game/login.html')


def register_view(request):
    """Vista de registro"""
    if request.user.is_authenticated:
        return redirect('index')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        email = request.POST.get('email', '')
        
        # Validaciones básicas
        if not username or not password:
            messages.error(request, 'Todos los campos son obligatorios')
            return render(request, 'game/register.html')
        
        if password != password2:
            messages.error(request, 'Las contraseñas no coinciden')
            return render(request, 'game/register.html')
        
        if len(password) < 6:
            messages.error(request, 'La contraseña debe tener al menos 6 caracteres')
            return render(request, 'game/register.html')
        
        from django.contrib.auth.models import User
        if User.objects.filter(username=username).exists():
            messages.error(request, 'El nombre de usuario ya existe')
            return render(request, 'game/register.html')
        
        # Crear usuario
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        
        messages.success(request, '¡Registro exitoso! Inicia sesión para jugar')
        return redirect('login')
    
    return render(request, 'game/register.html')


def logout_view(request):
    """Vista de cierre de sesión"""
    from django.contrib.auth import logout
    logout(request)
    messages.success(request, 'Sesión cerrada exitosamente')
    return redirect('login')


@login_required
def index(request):
    """Vista principal del juego"""
    profile, created = PlayerProfile.objects.get_or_create(user=request.user)
    
    # Inicializar animales si no existen
    if Animal.objects.count() == 0:
        inicializar_animales()
    
    context = {
        'profile': profile,
    }
    return render(request, 'game/index.html', context)


@login_required
@require_POST
def capturar_animal(request):
    """API para capturar animales"""
    try:
        data = json.loads(request.body)
        animal_id = data.get('animal_id')
        
        if not animal_id:
            return JsonResponse({'error': 'Animal ID requerido'}, status=400)
        
        animal = Animal.objects.get(id=animal_id)
        profile = request.user.playerprofile
        
        # Añadir puntos y experiencia
        profile.puntos += animal.puntos
        profile.experiencia += animal.experiencia
        
        # Verificar si sube de nivel
        nivel_subido = profile.calcular_nivel()
        profile.save()
        
        # Registrar captura
        captura, created = AnimalCapturado.objects.get_or_create(
            player=profile,
            animal=animal
        )
        if not created:
            captura.cantidad += 1
            captura.save()
        else:
            captura.cantidad = 1
            captura.save()
        
        return JsonResponse({
            'success': True,
            'puntos': profile.puntos,
            'experiencia': profile.experiencia,
            'nivel': profile.nivel,
            'nivel_subido': nivel_subido,
            'animal': {
                'nombre': animal.nombre,
                'emoji': animal.emoji,
                'puntos': animal.puntos,
                'descripcion': animal.descripcion,
                'habitat': animal.habitat,
                'dato_curioso': animal.dato_curioso
            }
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@login_required
def get_estadisticas(request):
    """API para obtener estadísticas del jugador"""
    profile = request.user.playerprofile
    animales = AnimalCapturado.objects.filter(player=profile)
    
    estadisticas = {
        'puntos': profile.puntos,
        'experiencia': profile.experiencia,
        'nivel': profile.nivel,
        'animales': []
    }
    
    for captura in animales:
        estadisticas['animales'].append({
            'nombre': captura.animal.nombre,
            'emoji': captura.animal.emoji,
            'cantidad': captura.cantidad
        })
    
    return JsonResponse(estadisticas)


@login_required
@require_POST
def comprar_item(request):
    """API para comprar items del mercado"""
    try:
        data = json.loads(request.body)
        item_nombre = data.get('item_nombre')
        costo = data.get('costo')
        
        if not item_nombre or not costo:
            return JsonResponse({'error': 'Datos incompletos'}, status=400)
        
        profile = request.user.playerprofile
        
        if profile.puntos < costo:
            return JsonResponse({'error': 'Puntos insuficientes'}, status=400)
        
        profile.puntos -= costo
        profile.save()
        
        Compra.objects.create(
            player=profile,
            item_nombre=item_nombre,
            costo=costo
        )
        
        return JsonResponse({
            'success': True,
            'puntos': profile.puntos
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def inicializar_animales():
    """Inicializa los animales en la base de datos"""
    animales = [
        {
            'nombre': 'León',
            'emoji': '🦁',
            'puntos': 50,
            'experiencia': 30,
            'descripcion': 'El león es el rey de la selva. Son felinos sociales que viven en manadas llamadas manadas.',
            'habitat': 'Sabanas africanas',
            'dato_curioso': 'Los leones pueden dormir hasta 20 horas al día'
        },
        {
            'nombre': 'Elefante',
            'emoji': '🐘',
            'puntos': 100,
            'experiencia': 50,
            'descripcion': 'El elefante es el mamífero terrestre más grande del mundo.',
            'habitat': 'África y Asia',
            'dato_curioso': 'Los elefantes tienen la memoria más larga que cualquier otro animal'
        },
        {
            'nombre': 'Tigre',
            'emoji': '🐅',
            'puntos': 75,
            'experiencia': 40,
            'descripcion': 'El tigre es el felino más grande del mundo.',
            'habitat': 'Ásia',
            'dato_curioso': 'Los tigres pueden nadar hasta 6 km de distancia'
        },
        {
            'nombre': 'Jirafa',
            'emoji': '🦒',
            'puntos': 60,
            'experiencia': 35,
            'descripcion': 'La jirafa es el mamífero más alto del mundo.',
            'habitat': 'África',
            'dato_curioso': 'Las jirafas tienen cuellos tan largos que tienen corazones especiales para bombear sangre al cerebro'
        },
        {
            'nombre': 'Oso',
            'emoji': '🐻',
            'puntos': 80,
            'experiencia': 45,
            'descripcion': 'Los osos son mamíferos omnívoros muy inteligentes.',
            'habitat': 'Varios continentes',
            'dato_curioso': 'Los osos pueden oler comida a kilómetros de distancia'
        },
        {
            'nombre': 'Mono',
            'emoji': '🐵',
            'puntos': 30,
            'experiencia': 20,
            'descripcion': 'Los monos son primates muy inteligentes.',
            'habitat': 'África, Asia y América',
            'dato_curioso': 'Los chimpancés comparten el 98% de su ADN con los humanos'
        },
        {
            'nombre': 'Cebra',
            'emoji': '🦓',
            'puntos': 40,
            'experiencia': 25,
            'descripcion': 'Las cebras son conocidas por sus rayas únicas.',
            'habitat': 'África',
            'dato_curioso': 'Cada cebra tiene un patrón de rayas único, como huellas dactilares humanas'
        },
        {
            'nombre': 'Hipopótamo',
            'emoji': '🦛',
            'puntos': 70,
            'experiencia': 38,
            'descripcion': 'El hipopótamo es uno de los animales más agresivos del mundo.',
            'habitat': 'África',
            'dato_curioso': 'A pesar de su apariencia pesada, los hipopótamos pueden correr hasta 30 km/h'
        },
        {
            'nombre': 'Panda',
            'emoji': '🐼',
            'puntos': 90,
            'experiencia': 48,
            'descripcion': 'El panda es un símbolo de conservación animal.',
            'habitat': 'China',
            'dato_curioso': 'Los pandas comen bambú durante 12 horas al día'
        },
        {
            'nombre': 'Lobo',
            'emoji': '🐺',
            'puntos': 65,
            'experiencia': 36,
            'descripcion': 'Los lobos son animales sociales que viven en manadas.',
            'habitat': 'América del Norte, Europa, Asia',
            'dato_curioso': 'Los lobos pueden comunicarse mediante aullidos hasta 10 km de distancia'
        }
    ]
    
    for animal_data in animales:
        Animal.objects.get_or_create(**animal_data)

