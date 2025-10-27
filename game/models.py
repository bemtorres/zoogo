from django.db import models
from django.contrib.auth.models import User


class PlayerProfile(models.Model):
    """Perfil del jugador con su progreso"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    puntos = models.IntegerField(default=0)
    experiencia = models.IntegerField(default=0)
    nivel = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.user.username} - Nivel {self.nivel}"
    
    def calcular_nivel(self):
        """Calcula el nivel basado en la experiencia"""
        exp_requerida = self.nivel * 100
        if self.experiencia >= exp_requerida:
            self.nivel += 1
            self.experiencia = self.experiencia - exp_requerida
            self.save()
            return True
        return False


class Animal(models.Model):
    """Modelo para los animales del juego"""
    nombre = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10)
    puntos = models.IntegerField()
    experiencia = models.IntegerField()
    descripcion = models.TextField()
    habitat = models.CharField(max_length=200)
    dato_curioso = models.TextField()


class AnimalCapturado(models.Model):
    """Registro de animales capturados por cada jugador"""
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE)
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    fecha_captura = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('player', 'animal')
    
    def __str__(self):
        return f"{self.player.user.username} - {self.animal.nombre} x{self.cantidad}"


class Compra(models.Model):
    """Registro de compras en el mercado"""
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE)
    item_nombre = models.CharField(max_length=100)
    costo = models.IntegerField()
    fecha_compra = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.player.user.username} - {self.item_nombre}"

