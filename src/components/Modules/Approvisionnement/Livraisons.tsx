import React, { useState } from 'react';
import { Search, Filter, FileText, Edit, Trash2, Plus, Package, Clock, CheckCircle } from 'lucide-react';

interface Livraison {
  id: number;
  numeroCommande: string;
  produit: string;
  quantite: number;
  dateLivraison: string;
  statut: 'Livrée' | 'À livrer' | 'En cours';
  bonLivraison?: {
    numero: string;
    livreur: string;
    dateCreation: string;
  };
}

const Livraisons: React.FC = () => {
  const [livraisons] = useState<Livraison[]>([
    {
      id: 1,
      numeroCommande: 'CMD-2024-001',
      produit: 'Smartphone XYZ Pro',
      quantite: 50,
      dateLivraison: '2024-01-30',
      statut: 'Livrée',
      bonLivraison: {
        numero: 'BL-2024-001',
        livreur: 'Transport Express',
        dateCreation: '2024-01-30'
      }
    },
    {
      id: 2,
      numeroCommande: 'CMD-2024-002',
      produit: 'Laptop Business 15"',
      quantite: 25,
      dateLivraison: '2024-02-05',
      statut: 'En cours',
      bonLivraison: {
        numero: 'BL-2024-002',
        livreur: 'LogiTech Delivery',
        dateCreation: '2024-02-03'
      }
    },
    {
      id: 3,
      numeroCommande: 'CMD-2024-003',
      produit: 'Tablet Pro 10"',
      quantite: 30,
      dateLivraison: '2024-02-10',
      statut: 'À livrer'
    }
  ]);

  const [selectedLivraison, setSelectedLivraison] = useState<Livraison | null>(null);
  const [showBonLivraisonForm, setShowBonLivraisonForm] = useState<number | null>(null);
  const [bonLivraisonData, setBonLivraisonData] = useState({
    numero: '',
    livreur: '',
    dateCreation: new Date().toISOString().split('T')[0]
  });

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Livrée':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'À livrer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'Livrée':
        return <CheckCircle className="w-4 h-4" />;
      case 'En cours':
        return <Clock className="w-4 h-4" />;
      case 'À livrer':
        return <Package className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleBonLivraisonSubmit = (e: React.FormEvent, livraisonId: number) => {
    e.preventDefault();
    console.log('Bon de livraison créé pour la livraison', livraisonId, bonLivraisonData);
    setBonLivraisonData({
      numero: '',
      livreur: '',
      dateCreation: new Date().toISOString().split('T')[0]
    });
    setShowBonLivraisonForm(null);
  };

  const livraisonsLivrees = livraisons.filter(l => l.statut === 'Livrée');
  const livraisonsALivrer = livraisons.filter(l => l.statut === 'À livrer');
  const livraisonsEnCours = livraisons.filter(l => l.statut === 'En cours');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Livraisons</h2>
          <p className="text-gray-600">Suivez et gérez toutes vos livraisons</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une livraison..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filtrer</span>
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">{livraisonsLivrees.length}</p>
              <p className="text-sm text-green-700">Commandes livrées</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{livraisonsEnCours.length}</p>
              <p className="text-sm text-blue-700">En cours de livraison</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">{livraisonsALivrer.length}</p>
              <p className="text-sm text-yellow-700">À livrer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des livraisons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de livraison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {livraisons.map((livraison) => (
                <tr key={livraison.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{livraison.numeroCommande}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{livraison.produit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{livraison.quantite}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(livraison.dateLivraison).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(livraison.statut)}`}>
                      {getStatutIcon(livraison.statut)}
                      <span>{livraison.statut}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {livraison.bonLivraison ? (
                        <button 
                          onClick={() => setSelectedLivraison(livraison)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir le bon de livraison"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => setShowBonLivraisonForm(livraison.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Ajouter un bon de livraison"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                      {livraison.bonLivraison && (
                        <>
                          <button className="text-blue-600 hover:text-blue-900" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulaire d'ajout de bon de livraison */}
      {showBonLivraisonForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un bon de livraison</h3>
            <form onSubmit={(e) => handleBonLivraisonSubmit(e, showBonLivraisonForm)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de bon</label>
                <input
                  type="text"
                  value={bonLivraisonData.numero}
                  onChange={(e) => setBonLivraisonData({...bonLivraisonData, numero: e.target.value})}
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
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
                <input
                  type="date"
                  value={bonLivraisonData.dateCreation}
                  onChange={(e) => setBonLivraisonData({...bonLivraisonData, dateCreation: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowBonLivraisonForm(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de détail du bon de livraison */}
      {selectedLivraison && selectedLivraison.bonLivraison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du bon de livraison</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Numéro de bon:</span>
                <p className="font-medium">{selectedLivraison.bonLivraison.numero}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Commande:</span>
                <p className="font-medium">{selectedLivraison.numeroCommande}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Produit:</span>
                <p className="font-medium">{selectedLivraison.produit}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Quantité:</span>
                <p className="font-medium">{selectedLivraison.quantite}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Livreur:</span>
                <p className="font-medium">{selectedLivraison.bonLivraison.livreur}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Date de création:</span>
                <p className="font-medium">
                  {new Date(selectedLivraison.bonLivraison.dateCreation).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Statut:</span>
                <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(selectedLivraison.statut)}`}>
                  {getStatutIcon(selectedLivraison.statut)}
                  <span>{selectedLivraison.statut}</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedLivraison(null)}
              className="w-full mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Livraisons;