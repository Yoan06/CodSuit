import React, { useState, useEffect, useCallback } from 'react';
import { Package, FileText, Eye } from 'lucide-react';
import { getProduits } from '../../../services/produitService';
import { getBonsCommande } from '../../../services/bonCommandeService';
import { getLivraisons } from '../../../services/livraisonService';

interface Produit {
  id: number;
  nom: string;
  categorie: string;
  fournisseur: number;
  date_lancement?: string;
}

interface BonCommande {
  id: number;
  numero: string;
  produit: number;
  quantite: number;
  date_debut: string;
  statut: string;
}

interface Livraison {
  id: number;
  numero_commande: string;
  produit: number;
  quantite: number;
  date_livraison: string;
  statut: string;
}

// Produit enrichi utilisé uniquement pour l'affichage agrégé
interface ProduitAvecBons extends Produit {
  bonsLivraison: Livraison[];
  bonsCommande: BonCommande[];
}

const CommandesAchats: React.FC = () => {
  const [selectedProduit, setSelectedProduit] = useState<ProduitAvecBons | null>(null);
  const [viewType, setViewType] = useState<'livraison' | 'commande'>('livraison');
  const [produits, setProduits] = useState<Produit[]>([]);
  const [bonsCommande, setBonsCommande] = useState<BonCommande[]>([]);
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Authentification et récupération du token
  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'yoan', password: 'test12345' })
        });
        if (response.ok) {
          const data = await response.json();
          setToken(data.access);
          localStorage.setItem('authToken', data.access);
        } else {
          setError("Impossible de s'authentifier");
        }
      } catch (err: unknown) {
        console.error("Erreur d'authentification:", err);
        setError("Erreur d'authentification");
      }
    };
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) setToken(storedToken);
    else authenticate();
  }, []);

  // Récupération des données
  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [resProduits, resBonsCommande, resLivraisons] = await Promise.all([
        getProduits(token),
        getBonsCommande(token),
        getLivraisons(token)
      ]);
      setProduits(resProduits.data);
      setBonsCommande(resBonsCommande.data);
      setLivraisons(resLivraisons.data);
    } catch (err: unknown) {
      console.error("Erreur lors du chargement des données:", err);
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchAll();
  }, [token, fetchAll]);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'livree':
      case 'recue':
        return 'bg-green-100 text-green-800';
      case 'en_cours':
      case 'envoyee':
        return 'bg-blue-100 text-blue-800';
      case 'a_envoyer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center text-gray-600">Chargement...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  // Regroupement des bons par produit
  const produitsAvecBons: ProduitAvecBons[] = produits.map((produit) => {
    const bonsLivraison = livraisons.filter(l => l.produit === produit.id);
    const bonsCommandeProduit = bonsCommande.filter(bc => bc.produit === produit.id);
    return {
      ...produit,
      bonsLivraison,
      bonsCommande: bonsCommandeProduit
    } as ProduitAvecBons;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commandes d'Achats</h2>
          <p className="text-gray-600">Visualisez tous vos produits et leurs bons associés</p>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bons de livraison</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bons de commande</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produitsAvecBons.map((produit) => (
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{produit.bonsLivraison.length}</span>
                      {produit.bonsLivraison.length > 0 && (
                        <button
                          onClick={() => { setSelectedProduit(produit); setViewType('livraison'); }}
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
                          onClick={() => { setSelectedProduit(produit); setViewType('commande'); }}
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{viewType === 'livraison' ? 'Date de livraison' : 'Date de commande'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {viewType === 'livraison'
                    ? selectedProduit.bonsLivraison.map((bon: Livraison) => (
                        <tr key={bon.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{bon.numero_commande}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{bon.quantite}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{new Date(bon.date_livraison).toLocaleDateString('fr-FR')}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(bon.statut)}`}>{bon.statut}</span>
                          </td>
                        </tr>
                      ))
                    : selectedProduit.bonsCommande.map((bon: BonCommande) => (
                        <tr key={bon.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{bon.numero}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{bon.quantite}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{new Date(bon.date_debut).toLocaleDateString('fr-FR')}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(bon.statut)}`}>{bon.statut}</span>
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