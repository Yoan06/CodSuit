from rest_framework import serializers
from .models import Fournisseur, Echeance, Produit, BonCommande, Livraison, CommandeAchat, ImportTransit, EtapeTransit, Saison, HistoriqueLieu

class FournisseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fournisseur
        fields = '__all__'
        read_only_fields = ['id', 'date_ajout', 'user', 'id_tenant']

class EcheanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Echeance
        fields = '__all__'
        read_only_fields = ['id', 'date_ajout', 'user', 'id_tenant']

class ProduitSerializer(serializers.ModelSerializer):
    saisons = serializers.PrimaryKeyRelatedField(queryset=Saison.objects.all(), many=True, required=False)
    class Meta:
        model = Produit
        fields = '__all__'
        read_only_fields = ['id', 'date_mise_a_jour', 'user', 'id_tenant']

class SaisonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Saison
        fields = '__all__'
        read_only_fields = ['id_tenant']

class BonCommandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BonCommande
        fields = '__all__'
        read_only_fields = ['id', 'date_creation', 'user', 'id_tenant']

class LivraisonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Livraison
        fields = '__all__'
        read_only_fields = ['id', 'date_creation', 'user', 'id_tenant']

class CommandeAchatSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandeAchat
        fields = '__all__'
        read_only_fields = ['id', 'date_creation', 'user', 'id_tenant']

class EtapeTransitSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtapeTransit
        fields = '__all__'

class ImportTransitSerializer(serializers.ModelSerializer):
    etapes = EtapeTransitSerializer(many=True, read_only=True)
    
    class Meta:
        model = ImportTransit
        fields = '__all__'
        read_only_fields = ['id', 'date_creation', 'user', 'id_tenant']

class HistoriqueLieuSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriqueLieu
        fields = '__all__'
        read_only_fields = ['id', 'date_creation', 'import_transit']