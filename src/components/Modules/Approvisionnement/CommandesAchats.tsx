import React, { useState } from 'react';
import { Search, Filter, Package, FileText, Eye } from 'lucide-react';

interface ProduitAchat {
  id: number;
  nom: string;
  categorie: string;
  fournisseur: string;
  dateAjout: string;
  bonsLivraison: {
    id: number;
    numero: string;
    quantite: number;
    dateLivraison: string;
    statut: string;
  }[];
  bonsCommande: {
    id: number;
    numero: string;
    quantite: number;
    dateCommande: string;
    statut: string;
  }[];
}

const CommandesAchats: React.FC = () => {
  const [selectedProduit, setSelectedProduit] = useState<ProduitAchat | null>(null);
  const [viewType, setViewType] = useState<'livraison' | 'commande'>('livraison');
  
  const [produits] = useState<ProduitAchat[]>([
    {
      id: 1,
      nom: 'Smartphone XYZ Pro',
      categorie: 'Électronique',
      fournisseur: 'TechnoSupply SARL',
      dateAjout: '2024-01-15',
      bonsLivraison: [
        {
          id: 1,
          numero: 'BL-2024-001',
          quantite: 50,
          dateLivraison: '2024-01-30',
          statut: 'Livré'
        },
        {
          id: 2,
          numero: 'BL-2024-005',
          quantite: 25,
          dateLivraison: '2024-02-15',
          statut: 'En transit'
        }
      ],
      bonsCommande: [
        {
          id: 1,
          numero: 'BC-2024-001',
          quantite: 75,
          dateCommande: '2024-01-15',
          statut: 'Envoyée'
        }
      ]
    },
    {
      id: 2,
      nom: 'Laptop Business 15"',
      categorie: 'Informatique',
      fournisseur: 'GlobalParts Ltd',
      dateAjout: '2024-01-20',
      bonsLivraison: [
        {
          id: 3,
          numero: 'BL-2024-003',
          quantite: 20,
          dateLivraison: '2024-02-05',
          statut: 'Livré'
        }
      ],
      bonsCommande: [
        {
          id: 2,
          numero: 'BC-2024-002',
          quantite: 25,
          dateCommande: '2024-01-20',
          statut: 'Reçue'
        },
        {
          id: 3,
          numero: 'BC-2024-007',
          quantite: 15,
          dateCommande: '2024-02-10',
          statut: 'À envoyer'
        }
      ]
    },
    {
      id: 3,
      nom: 'Tablet Pro 10"',
      categorie: 'Électronique',
      fournisseur: 'TechAccessories Inc',
      dateAjout: '2024-02-01',
      bonsLivraison: [],
      bonsCommande: [
        {
          id: 4,
          numero: 'BC-2024-004',
          quantite: 30,
          dateCommande: '2024-02-01',
          statut: 'À envoyer'
        }
      ]
    }
  ]);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Livré':
      case 'Reçue':
        return 'bg-green-100 text-green-800';
      case 'En transit':
      case 'Envoyée':
        return 'bg-blue-100 text-blue-800';
      case 'À envoyer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewBons = (produit: ProduitAchat, type: 'livraison' | 'commande') => {
    setSelectedProduit(produit);
    setViewType(type);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commandes d'Achats</h2>
          <p className="text-gray-600">Visualisez tous vos produits et leurs bons associés</p>
        </div>
      </div>

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

      {/* Liste des produits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'ajout
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bons de livraison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bons de commande
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produits.map((produit) => (
                <tr key={produit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-8 h-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{produit.nom}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {produit.categorie}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{produit.fournisseur}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(produit.dateAjout).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{produit.bonsLivraison.length}</span>
                      {produit.bonsLivraison.length > 0 && (
                        <button
                          onClick={() => handleViewBons(produit, 'livraison')}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir les bons de livraison"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{produit.bonsCommande.length}</span>
                      {produit.bonsCommande.length > 0 && (
                        <button
                          onClick={() => handleViewBons(produit, 'commande')}
                          className="text-green-600 hover:text-green-900"
                          title="Voir les bons de commande"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">Détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de visualisation des bons */}
      {selectedProduit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {viewType === 'livraison' ? 'Bons de Livraison' : 'Bons de Commande'} - {selectedProduit.nom}
              </h3>
              <button
                onClick={() => setSelectedProduit(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setViewType('livraison')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    viewType === 'livraison'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Bons de Livraison ({selectedProduit.bonsLivraison.length})</span>
                </button>
                <button
                  onClick={() => setViewType('commande')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    viewType === 'commande'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Bons de Commande ({selectedProduit.bonsCommande.length})</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Numéro
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantité
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {viewType === 'livraison' ? 'Date de livraison' : 'Date de commande'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {viewType === 'livraison' 
                    ? selectedProduit.bonsLivraison.map((bon) => (
                        <tr key={bon.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{bon.numero}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{bon.quantite}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {new Date(bon.dateLivraison).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(bon.statut)}`}>
                              {bon.statut}
                            </span>
                          </td>
                        </tr>
                      ))
                    : selectedProduit.bonsCommande.map((bon) => (
                        <tr key={bon.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{bon.numero}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{bon.quantite}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {new Date(bon.dateCommande).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(bon.statut)}`}>
                              {bon.statut}
                            </span>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>

            {((viewType === 'livraison' && selectedProduit.bonsLivraison.length === 0) ||
              (viewType === 'commande' && selectedProduit.bonsCommande.length === 0)) && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Aucun {viewType === 'livraison' ? 'bon de livraison' : 'bon de commande'} trouvé pour ce produit.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandesAchats;