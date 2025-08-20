from django.contrib import admin

from .models import Tenant, UserProfile


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "tenant", "created_at")
    search_fields = ("user__username", "tenant__name")
    list_select_related = ("user", "tenant")

from django.contrib import admin
from .models import (
    Fournisseur, Echeance, Produit, BonCommande, 
    Livraison, CommandeAchat, ImportTransit, EtapeTransit, Saison
)

admin.site.register(Fournisseur)
admin.site.register(Echeance)
admin.site.register(Produit)
admin.site.register(BonCommande)
admin.site.register(Livraison)
admin.site.register(CommandeAchat)
admin.site.register(ImportTransit)
admin.site.register(EtapeTransit)
admin.site.register(Saison)