from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FournisseurViewSet, EcheanceViewSet, ProduitViewSet, 
    BonCommandeViewSet, LivraisonViewSet, CommandeAchatViewSet, 
    ImportTransitViewSet, EtapeTransitViewSet, SaisonViewSet,
    HistoriqueLieuViewSet
)

router = DefaultRouter()
router.register(r'fournisseurs', FournisseurViewSet, basename='fournisseur')
router.register(r'echeances', EcheanceViewSet, basename='echeance')
router.register(r'produits', ProduitViewSet, basename='produit')
router.register(r'bons-commande', BonCommandeViewSet, basename='boncommande')
router.register(r'livraisons', LivraisonViewSet, basename='livraison')
router.register(r'commandes-achat', CommandeAchatViewSet, basename='commandeachat')
router.register(r'import-transit', ImportTransitViewSet, basename='importtransit')
router.register(r'etapes-transit', EtapeTransitViewSet, basename='etapetransit')
router.register(r'saisons', SaisonViewSet, basename='saison')
router.register(r'historique-lieux', HistoriqueLieuViewSet, basename='historiquelieu')

urlpatterns = [
    path('', include(router.urls)),

]