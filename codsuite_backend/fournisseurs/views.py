from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Tenant, UserProfile, Fournisseur, Echeance, Produit, BonCommande, Livraison, CommandeAchat, ImportTransit, EtapeTransit, Saison, HistoriqueLieu
from .serializers import (
    FournisseurSerializer, EcheanceSerializer, ProduitSerializer, 
    BonCommandeSerializer, LivraisonSerializer, CommandeAchatSerializer, 
    ImportTransitSerializer, EtapeTransitSerializer, SaisonSerializer, HistoriqueLieuSerializer
)

class FournisseurViewSet(viewsets.ModelViewSet):
    queryset = Fournisseur.objects.none()
    serializer_class = FournisseurSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        return Fournisseur.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        serializer.save(tenant=tenant)

class EcheanceViewSet(viewsets.ModelViewSet):
    queryset = Echeance.objects.none()
    serializer_class = EcheanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        return Echeance.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        serializer.save(tenant=tenant)

class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.none()
    serializer_class = ProduitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        return Produit.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        serializer.save(tenant=tenant)

class BonCommandeViewSet(viewsets.ModelViewSet):
    queryset = BonCommande.objects.none()
    serializer_class = BonCommandeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        return BonCommande.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        serializer.save(tenant=tenant)

class LivraisonViewSet(viewsets.ModelViewSet):
    queryset = Livraison.objects.none()
    serializer_class = LivraisonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        return Livraison.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        serializer.save(tenant=tenant)

class CommandeAchatViewSet(viewsets.ModelViewSet):
    queryset = CommandeAchat.objects.none()
    serializer_class = CommandeAchatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        return CommandeAchat.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        serializer.save(tenant=tenant)

class ImportTransitViewSet(viewsets.ModelViewSet):
    queryset = ImportTransit.objects.none()
    serializer_class = ImportTransitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        return ImportTransit.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        serializer.save(tenant=tenant)

class EtapeTransitViewSet(viewsets.ModelViewSet):
    queryset = EtapeTransit.objects.none()
    serializer_class = EtapeTransitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        return EtapeTransit.objects.filter(import_transit__tenant=tenant)

class SaisonViewSet(viewsets.ModelViewSet):
    queryset = Saison.objects.all()
    serializer_class = SaisonSerializer
    permission_classes = [IsAuthenticated]

class HistoriqueLieuViewSet(viewsets.ModelViewSet):
    serializer_class = HistoriqueLieuSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(getattr(self.request.user, 'profile', None), 'tenant', None)
        return HistoriqueLieu.objects.filter(import_transit__tenant=tenant)

    def perform_create(self, serializer):
        serializer.save()