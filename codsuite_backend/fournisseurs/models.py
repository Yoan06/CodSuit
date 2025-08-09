from django.db import models
from django.conf import settings

class Saison(models.Model):
    nom = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name_plural = "Saisons"
        ordering = ['nom']

    def __str__(self):
        return self.nom

class Fournisseur(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    nom = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    adresse = models.CharField(max_length=255, blank=True, null=True)
    ville = models.CharField(max_length=100, blank=True, null=True)
    pays = models.CharField(max_length=100, blank=True, null=True)
    date_ajout = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Fournisseurs"
        ordering = ['nom']

    def __str__(self):
        return self.nom

class Echeance(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    titre = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    date_echeance = models.DateField()
    montant = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    statut = models.CharField(max_length=20, choices=[
        ('en_attente', 'En attente'),
        ('paye', 'Payé'),
        ('retard', 'En retard'),
        ('annule', 'Annulé')
    ], default='en_attente')
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.CASCADE, blank=True, null=True)
    date_ajout = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Échéances"
        ordering = ['date_echeance']

    def __str__(self):
        return f"{self.titre} - {self.date_echeance}"

class Produit(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    nom = models.CharField(max_length=255)
    categorie = models.CharField(max_length=100)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.CASCADE)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    stock_actuel = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    date_lancement = models.DateField(blank=True, null=True)
    date_mise_a_jour = models.DateTimeField(auto_now=True)
    statut = models.CharField(max_length=20, choices=[
        ('actif', 'Actif'),
        ('inactif', 'Inactif'),
        ('fin_de_vie', 'Fin de vie')
    ], default='actif')
    saisons = models.ManyToManyField(Saison, blank=True, related_name='produits')

    class Meta:
        verbose_name_plural = "Produits"
        ordering = ['nom']

    def __str__(self):
        return self.nom

class BonCommande(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    numero = models.CharField(max_length=50, unique=True)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.CASCADE)
    date_debut = models.DateField()
    date_fin = models.DateField()
    quantite = models.IntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
    statut = models.CharField(max_length=20, choices=[
        ('a_envoyer', 'À envoyer'),
        ('envoyee', 'Envoyée'),
        ('recue', 'Reçue'),
        ('annulee', 'Annulée')
    ], default='a_envoyer')
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Bons de commande"
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.numero} - {self.produit.nom}"

class Livraison(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    numero_commande = models.CharField(max_length=50)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    quantite = models.IntegerField()
    date_livraison = models.DateField()
    statut = models.CharField(max_length=20, choices=[
        ('a_livrer', 'À livrer'),
        ('en_cours', 'En cours'),
        ('livree', 'Livrée')
    ], default='a_livrer')
    bon_livraison_numero = models.CharField(max_length=50, blank=True, null=True)
    livreur = models.CharField(max_length=100, blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Livraisons"
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.numero_commande} - {self.produit.nom}"

class CommandeAchat(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    numero = models.CharField(max_length=50, unique=True)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.CASCADE)
    quantite = models.IntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
    date_commande = models.DateField()
    date_livraison_prevue = models.DateField()
    statut = models.CharField(max_length=20, choices=[
        ('en_attente', 'En attente'),
        ('confirmee', 'Confirmée'),
        ('en_livraison', 'En livraison'),
        ('livree', 'Livrée'),
        ('annulee', 'Annulée')
    ], default='en_attente')
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Commandes d'achat"
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.numero} - {self.produit.nom}"

class ImportTransit(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    numero_commande = models.CharField(max_length=50, unique=True)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.CASCADE)
    quantite = models.IntegerField()
    pays_origine = models.CharField(max_length=100)
    region_actuelle = models.CharField(max_length=100)
    lieu_actuel = models.CharField(max_length=255)
    statut = models.CharField(max_length=20, choices=[
        ('en_transit', 'En transit'),
        ('douane', 'Douane'),
        ('livre', 'Livré'),
        ('bloque', 'Bloqué')
    ], default='en_transit')
    date_expedition = models.DateField()
    date_livraison_prevue = models.DateField()
    transporteur = models.CharField(max_length=100)
    numero_suivi = models.CharField(max_length=100)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Import/Transit"
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.numero_commande} - {self.produit.nom}"

class EtapeTransit(models.Model):
    import_transit = models.ForeignKey(ImportTransit, on_delete=models.CASCADE, related_name='etapes')
    lieu = models.CharField(max_length=255)
    date = models.DateField()
    statut = models.CharField(max_length=50)
    description = models.TextField()
    ordre = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "Étapes de transit"
        ordering = ['ordre', 'date']

    def __str__(self):
        return f"{self.import_transit.numero_commande} - {self.lieu}"