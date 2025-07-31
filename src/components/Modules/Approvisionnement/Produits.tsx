import React, { useState } from 'react';
import { Plus, Search, Filter, TrendingUp, TrendingDown, Package, Truck, BarChart3, Calendar, Edit } from 'lucide-react';

interface Produit {
  id: number;
  nom: string;
  categorie: string;
  fournisseur: string;
  prix: number;
  stockActuel: number;
  ventesRecentes: number;
  dateLancement: string;
  dateMiseAJour: string;
  statut: 'Actif' | 'Inactif' | 'Fin de vie';
  performance: {
    ventesEvolution: number;
    stockEvolution: number;
  };
}

const Produits: React.FC = () => {
  const [showBonLivraisonForm, setShowBonLivraisonForm] = useState<number | null>(null);
  const [showProduitForm, setShowProduitForm] = useState(false);
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
  const [produits] = useState<Produit[]>([
    {
      id: 1,
      nom: 'Smartphone XYZ Pro',
      categorie: 'Électronique',
      fournisseur: 'TechnoSupply SARL',
      prix: 599.99,
      stockActuel: 45,
      ventesRecentes: 23,
      dateLancement: '2024-01-15',
      dateMiseAJour: '2024-11-01',
      statut: 'Actif',
      performance: {
        ventesEvolution: 15.2,
        stockEvolution: -8.5
      }
    },
    {
      id: 2,
      nom: 'Laptop Business 15"',
      categorie: 'Informatique',
      fournisseur: 'GlobalParts Ltd',
      prix: 899.99,
      stockActuel: 12,
      ventesRecentes: 8,
      dateLancement: '2023-09-10',
      dateMiseAJour: '2024-10-15',
      statut: 'Actif',
      performance: {
        ventesEvolution: -5.3,
        stockEvolution: -12.1
      }
    }
  ]);

  const [bonLivraisonData, setBonLivraisonData] = useState({
    quantite: '',
    dateLivraison: '',
    numeroBon: '',
    livreur: '',
    statut: 'En transit'
  });

  const [produitFormData, setProduitFormData] = useState({
    nom: '',
    categorie: '',
    fournisseur: '',
    prix: '',
    stockActuel: '',
    description: ''
  });
  
  const fournisseurs = ['TechnoSupply SARL', 'GlobalParts Ltd', 'LocalDistrib'];
  const categories = ['Électronique', 'Informatique', 'Accessoires', 'Mobilier', 'Fournitures'];

  const handleBonLivraisonSubmit = (e: React.FormEvent, produitId: number) => {
    e.preventDefault();
    console.log('Bon de livraison créé pour le produit', produitId, bonLivraisonData);
    setBonLivraisonData({
      quantite: '',
      dateLivraison: '',
      numeroBon: '',
      livreur: '',
      statut: 'En transit'
    });
    setShowBonLivraisonForm(null);
  };

  const handleProduitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Produit ajouté/modifié:', produitFormData);
    setProduitFormData({
      nom: '',
      categorie: '',
      fournisseur: '',
      prix: '',
      stockActuel: '',
      description: ''
    });
    setShowProduitForm(false);
    setEditingProduit(null);
  };

  const handleEditProduit = (produit: Produit) => {
    setEditingProduit(produit);
    setProduitFormData({
      nom: produit.nom,
      categorie: produit.categorie,
      fournisseur: produit.fournisseur,
      prix: produit.prix.toString(),
      stockActuel: produit.stockActuel.toString(),
      description: ''
    });
    setShowProduitForm(true);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'Inactif':
        return 'bg-gray-100 text-gray-800';
      case 'Fin de vie':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
          <p className="text-gray-600">Gérez votre catalogue et suivez les performances</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nouveau produit</span>
        </button>
      </div>

      {/* Formulaire d'ajout/modification de produit */}
      {showProduitForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingProduit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h3>
          <form onSubmit={handleProduitSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
              <input
                type="text"
                value={produitFormData.nom}
                onChange={(e) => setProduitFormData({...produitFormData, nom: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                value={produitFormData.categorie}
                onChange={(e) => setProduitFormData({...produitFormData, categorie: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur *</label>
              <select
                value={produitFormData.fournisseur}
                onChange={(e) => setProduitFormData({...produitFormData, fournisseur: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un fournisseur</option>
                {fournisseurs.map((fournisseur) => (
                  <option key={fournisseur} value={fournisseur}>{fournisseur}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€) *</label>
              <input
                type="number"
                step="0.01"
                value={produitFormData.prix}
                onChange={(e) => setProduitFormData({...produitFormData, prix: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock initial</label>
              <input
                type="number"
                value={produitFormData.stockActuel}
                onChange={(e) => setProduitFormData({...produitFormData, stockActuel: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={produitFormData.description}
                onChange={(e) => setProduitFormData({...produitFormData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingProduit ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProduitForm(false);
                  setEditingProduit(null);
                  setProduitFormData({
                    nom: '',
                    categorie: '',
                    fournisseur: '',
                    prix: '',
                    stockActuel: '',
                    description: ''
                  });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filtrer</span>
        </button>
      </div>

      <div className="grid gap-6">
        {produits.map((produit) => (
          <div key={produit.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Informations principales */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{produit.nom}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(produit.statut)}`}>
                    {produit.statut}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Catégorie</p>
                    <p className="font-medium text-gray-900">{produit.categorie}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fournisseur</p>
                    <p className="font-medium text-gray-900">{produit.fournisseur}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prix</p>
                    <p className="font-medium text-gray-900">{formatCurrency(produit.prix)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock actuel</p>
                    <p className="font-medium text-gray-900">{produit.stockActuel} unités</p>
                  </div>
                </div>

                {/* Indicateurs de performance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Ventes récentes</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg font-bold text-blue-900">{produit.ventesRecentes}</span>
                      <div className="flex items-center space-x-1">
                        {produit.performance.ventesEvolution > 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs ${produit.performance.ventesEvolution > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {Math.abs(produit.performance.ventesEvolution)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Évolution stock</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg font-bold text-green-900">{produit.stockActuel}</span>
                      <div className="flex items-center space-x-1">
                        {produit.performance.stockEvolution > 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs ${produit.performance.stockEvolution > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {Math.abs(produit.performance.stockEvolution)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Cycle de vie</span>
                    </div>
                    <div className="mt-1">
                      <p className="text-xs text-purple-700">Lancé: {new Date(produit.dateLancement).toLocaleDateString('fr-FR')}</p>
                      <p className="text-xs text-purple-700">MAJ: {new Date(produit.dateMiseAJour).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => setShowBonLivraisonForm(produit.id)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Truck className="w-4 h-4" />
                  <span>Ajouter bon de livraison</span>
                </button>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Modifier produit</span>
                </button>
              </div>
            </div>

            {/* Formulaire bon de livraison */}
            {showBonLivraisonForm === produit.id && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Créer un bon de livraison pour {produit.nom}</h4>
                <form onSubmit={(e) => handleBonLivraisonSubmit(e, produit.id)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité livrée</label>
                    <input
                      type="number"
                      value={bonLivraisonData.quantite}
                      onChange={(e) => setBonLivraisonData({...bonLivraisonData, quantite: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de livraison</label>
                    <input
                      type="date"
                      value={bonLivraisonData.dateLivraison}
                      onChange={(e) => setBonLivraisonData({...bonLivraisonData, dateLivraison: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de bon</label>
                    <input
                      type="text"
                      value={bonLivraisonData.numeroBon}
                      onChange={(e) => setBonLivraisonData({...bonLivraisonData, numeroBon: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Livreur/Transporteur</label>
                    <input
                      type="text"
                      value={bonLivraisonData.livreur}
                      onChange={(e) => setBonLivraisonData({...bonLivraisonData, livreur: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      value={bonLivraisonData.statut}
                      onChange={(e) => setBonLivraisonData({...bonLivraisonData, statut: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="En transit">En transit</option>
                      <option value="Livré">Livré</option>
                      <option value="En attente">En attente</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex space-x-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Créer le bon
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBonLivraisonForm(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Produits;