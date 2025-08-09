from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Fournisseur, Echeance, Produit, BonCommande, Livraison, CommandeAchat, ImportTransit, EtapeTransit, Saison
from .serializers import (
    FournisseurSerializer, EcheanceSerializer, ProduitSerializer, 
    BonCommandeSerializer, LivraisonSerializer, CommandeAchatSerializer, 
    ImportTransitSerializer, EtapeTransitSerializer, SaisonSerializer
)

class FournisseurViewSet(viewsets.ModelViewSet):
    queryset = Fournisseur.objects.none()
    serializer_class = FournisseurSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Fournisseur.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EcheanceViewSet(viewsets.ModelViewSet):
    queryset = Echeance.objects.none()
    serializer_class = EcheanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Echeance.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.none()
    serializer_class = ProduitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Produit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BonCommandeViewSet(viewsets.ModelViewSet):
    queryset = BonCommande.objects.none()
    serializer_class = BonCommandeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BonCommande.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LivraisonViewSet(viewsets.ModelViewSet):
    queryset = Livraison.objects.none()
    serializer_class = LivraisonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Livraison.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommandeAchatViewSet(viewsets.ModelViewSet):
    queryset = CommandeAchat.objects.none()
    serializer_class = CommandeAchatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CommandeAchat.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ImportTransitViewSet(viewsets.ModelViewSet):
    queryset = ImportTransit.objects.none()
    serializer_class = ImportTransitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ImportTransit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EtapeTransitViewSet(viewsets.ModelViewSet):
    queryset = EtapeTransit.objects.none()
    serializer_class = EtapeTransitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EtapeTransit.objects.filter(import_transit__user=self.request.user)

class SaisonViewSet(viewsets.ModelViewSet):
    queryset = Saison.objects.all()
    serializer_class = SaisonSerializer
    permission_classes = [IsAuthenticated]