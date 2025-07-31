import React, { useState } from 'react';
import { Plus, Search, Filter, FileText, Truck, Calendar, User } from 'lucide-react';

interface BonCommande {
  id: number;
  nomProduit: string;
  fournisseur: string;
  dateDebut: string;
  dateFin: string;
  quantite: number;
  prixUnitaire: number;
  statut: 'Envoyée' | 'Reçue' | 'Annulée' | 'À envoyer';
}

const BonsCommande: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showBonLivraisonForm, setShowBonLivraisonForm] = useState<number | null>(null);
  const [bonsCommande, setBonsCommande] = useState<BonCommande[]>([
    {
      id: 1,
      nomProduit: 'Smartphone XYZ Pro',
      fournisseur: 'TechnoSupply SARL',
      dateDebut: '2024-01-15',
      dateFin: '2024-01-30',
      quantite: 50,
      prixUnitaire: 450.00,
      statut: 'Envoyée'
    },
    {
      id: 2,
      nomProduit: 'Laptop Business 15"',
      fournisseur: 'GlobalParts Ltd',
      dateDebut: '2024-01-20',
      dateFin: '2024-02-05',
      quantite: 25,
      prixUnitaire: 750.00,
      statut: 'À envoyer'
    }
  ]);

  const [formData, setFormData] = useState({
    nomProduit: '',
    fournisseur: '',
    dateDebut: '',
    dateFin: '',
    quantite: '',
    prixUnitaire: '',
    statut: 'À envoyer'
  });

  const [bonLivraisonData, setBonLivraisonData] = useState({
    quantite: '',
    dateLivraison: '',
    numeroBon: '',
    livreur: '',
    statut: 'En transit'
  });

  const fournisseurs = ['TechnoSupply SARL', 'GlobalParts Ltd', 'LocalDistrib'];
  const produits = ['Smartphone XYZ Pro', 'Laptop Business 15"', 'Tablet Pro 10"'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBonCommande: BonCommande = {
      id: bonsCommande.length + 1,
      ...formData,
      quantite: parseInt(formData.quantite),
      prixUnitaire: parseFloat(formData.prixUnitaire),
      statut: formData.statut as BonCommande['statut']
    };
    setBonsCommande([...bonsCommande, newBonCommande]);
    setFormData({
      nomProduit: '',
      fournisseur: '',
      dateDebut: '',
      dateFin: '',
      quantite: '',
      prixUnitaire: '',
      statut: 'À envoyer'
    });
    setShowForm(false);
  };

  const handleBonLivraisonSubmit = (e: React.FormEvent, commandeId: number) => {
    e.preventDefault();
    console.log('Bon de livraison créé pour la commande', commandeId, bonLivraisonData);
    setBonLivraisonData({
      quantite: '',
      dateLivraison: '',
      numeroBon: '',
      livreur: '',
      statut: 'En transit'
    });
    setShowBonLivraisonForm(null);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Envoyée':
        return 'bg-blue-100 text-blue-800';
      case 'Reçue':
        return 'bg-green-100 text-green-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      case 'À envoyer':
        return 'bg-yellow-100 text-yellow-800';
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

  const commandesEnvoyees = bonsCommande.filter(cmd => cmd.statut === 'Envoyée' || cmd.statut === 'Reçue');
  const commandesAEnvoyer = bonsCommande.filter(cmd => cmd.statut === 'À envoyer');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Bons de Commande</h2>
          <p className="text-gray-600">Gérez vos commandes fournisseurs et leurs livraisons</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau bon de commande</span>
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un nouveau bon de commande</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
              <select
                value={formData.nomProduit}
                onChange={(e) => setFormData({...formData, nomProduit: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un produit</option>
                {produits.map((produit) => (
                  <option key={produit} value={produit}>{produit}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <select
                value={formData.fournisseur}
                onChange={(e) => setFormData({...formData, fournisseur: e.target.value})}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input
                type="number"
                value={formData.quantite}
                onChange={(e) => setFormData({...formData, quantite: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire</label>
              <input
                type="number"
                step="0.01"
                value={formData.prixUnitaire}
                onChange={(e) => setFormData({...formData, prixUnitaire: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Commandes à envoyer */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-yellow-600" />
          Commandes à envoyer ({commandesAEnvoyer.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fournisseur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {commandesAEnvoyer.map((commande) => (
                <tr key={commande.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{commande.nomProduit}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{commande.fournisseur}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {new Date(commande.dateDebut).toLocaleDateString('fr-FR')} - {new Date(commande.dateFin).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{commande.quantite}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{formatCurrency(commande.quantite * commande.prixUnitaire)}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Envoyer</button>
                    <button className="text-gray-600 hover:text-gray-900">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commandes envoyées */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Commandes envoyées ({commandesEnvoyees.length})
        </h3>
        <div className="space-y-4">
          {commandesEnvoyees.map((commande) => (
            <div key={commande.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{commande.nomProduit}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(commande.statut)}`}>
                      {commande.statut}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Fournisseur:</span>
                      <p className="font-medium">{commande.fournisseur}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Période:</span>
                      <p className="font-medium">
                        {new Date(commande.dateDebut).toLocaleDateString('fr-FR')} - {new Date(commande.dateFin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantité:</span>
                      <p className="font-medium">{commande.quantite}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <p className="font-medium">{formatCurrency(commande.quantite * commande.prixUnitaire)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => setShowBonLivraisonForm(commande.id)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Ajouter bon de livraison</span>
                  </button>
                </div>
              </div>

              {/* Formulaire bon de livraison */}
              {showBonLivraisonForm === commande.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h5 className="text-md font-semibold text-gray-900 mb-3">Créer un bon de livraison</h5>
                  <form onSubmit={(e) => handleBonLivraisonSubmit(e, commande.id)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantité livrée</label>
                      <input
                        type="number"
                        value={bonLivraisonData.quantite}
                        onChange={(e) => setBonLivraisonData({...bonLivraisonData, quantite: e.target.value})}
                        required
                        max={commande.quantite}
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
    </div>
  );
};

export default BonsCommande;