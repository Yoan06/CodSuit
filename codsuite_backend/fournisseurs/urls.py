from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FournisseurViewSet, EcheanceViewSet, ProduitViewSet, 
    BonCommandeViewSet, LivraisonViewSet, CommandeAchatViewSet, 
    ImportTransitViewSet, EtapeTransitViewSet, SaisonViewSet
)

router = DefaultRouter()
router.register(r'fournisseurs', FournisseurViewSet)
router.register(r'echeances', EcheanceViewSet)
router.register(r'produits', ProduitViewSet)
router.register(r'bons-commande', BonCommandeViewSet)
router.register(r'livraisons', LivraisonViewSet)
router.register(r'commandes-achat', CommandeAchatViewSet)
router.register(r'import-transit', ImportTransitViewSet)
router.register(r'etapes-transit', EtapeTransitViewSet)
router.register(r'saisons', SaisonViewSet)

urlpatterns = [
    path('', include(router.urls)),
]