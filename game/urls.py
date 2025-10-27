from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # Autenticación
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    
    # Juego
    path('', views.index, name='index'),
    
    # API
    path('api/capturar/', views.capturar_animal, name='capturar_animal'),
    path('api/estadisticas/', views.get_estadisticas, name='get_estadisticas'),
    path('api/comprar/', views.comprar_item, name='comprar_item'),
]

