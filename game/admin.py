from django.contrib import admin
from .models import PlayerProfile, Animal, AnimalCapturado, Compra


@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nivel', 'puntos', 'experiencia')
    search_fields = ('user__username',)


@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'emoji', 'puntos', 'experiencia')
    search_fields = ('nombre',)


@admin.register(AnimalCapturado)
class AnimalCapturadoAdmin(admin.ModelAdmin):
    list_display = ('player', 'animal', 'cantidad', 'fecha_captura')
    search_fields = ('player__user__username', 'animal__nombre')


@admin.register(Compra)
class CompraAdmin(admin.ModelAdmin):
    list_display = ('player', 'item_nombre', 'costo', 'fecha_compra')
    search_fields = ('player__user__username', 'item_nombre')

