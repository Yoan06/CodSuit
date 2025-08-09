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