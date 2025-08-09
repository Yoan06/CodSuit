import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getProduits, createProduit, updateProduit, deleteProduit } from '../../../services/produitService';
import { getFournisseurs } from '../../../services/fournisseurService';
import { getSaisons } from '../../../services/saisonService';
import { AxiosError } from 'axios';

interface Fournisseur {
  id: number;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  date_ajout?: string;
}

interface Produit {
  id: number;
  nom: string;
  categorie: string;
  fournisseur: number;
  prix: number;
  stock_actuel: number;
  description?: string;
  date_lancement?: string;
  date_mise_a_jour?: string;
  statut: 'actif' | 'inactif' | 'fin_de_vie';
  saisons?: number[];
}

interface Saison {
  id: number;
  nom: string;
}

const Produits: React.FC = () => {
  const [showProduitForm, setShowProduitForm] = useState(false);
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [saisons, setSaisons] = useState<Saison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [produitFormData, setProduitFormData] = useState({
    nom: '',
    categorie: '',
    fournisseur: '',
    prix: '',
    stock_actuel: '',
    description: '',
    date_lancement: '',
    statut: 'actif' as 'actif' | 'inactif' | 'fin_de_vie',
    saisons: [] as number[]
  });
  
  const categories = ['Électronique', 'Informatique', 'Accessoires', 'Mobilier', 'Fournitures'];

  // Helper function pour vérifier si une erreur est une AxiosError
  const isAxiosError = (err: unknown): err is AxiosError => {
    return (err as AxiosError).isAxiosError === true;
  };

  // Récupérer le token depuis le localStorage ou une autre source
  useEffect(() => {
    const authenticate = async () => {
      console.log('🔐 Tentative d\'authentification...');
      try {
        const response = await fetch('http://localhost:8000/api/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'yoan',
            password: 'test12345'
          })
        });
        
        console.log('📡 Réponse du serveur:', response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Authentification réussie:', data);
          setToken(data.access);
          localStorage.setItem('authToken', data.access);
        } else {
          const errorData = await response.text();
          console.error('❌ Erreur d\'authentification:', errorData);
          setError(`Impossible de s'authentifier: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error("❌ Erreur d'authentification:", err);
        setError("Erreur de connexion au serveur. Vérifiez que le backend Django est démarré.");
      }
    };

    // Essayer d'abord de récupérer le token stocké
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      console.log('🔑 Token trouvé dans le localStorage');
      setToken(storedToken);
    } else {
      console.log('🔑 Aucun token trouvé, authentification nécessaire');
      authenticate();
    }
  }, []);

  const fetchProduits = useCallback(async () => {
    if (!token) {
      console.log('🚫 Pas de token disponible pour récupérer les produits');
      return;
    }
    console.log('📡 Récupération des produits avec le token:', token.substring(0, 20) + '...');
    setLoading(true);
    setError(null);
    try {
      const res = await getProduits(token);
      console.log('✅ Produits récupérés:', res.data);
      setProduits(res.data);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error("❌ Erreur lors du chargement des produits :", err);
        console.error("Status:", err.response?.status);
        console.error("Status Text:", err.response?.statusText);
        console.error("Détails de l'erreur:", err.response?.data || err.message);
        
        if (err.response?.status === 401) {
          console.log('🔑 Token expiré ou invalide, suppression du token...');
          localStorage.removeItem('authToken');
          setToken(null);
          setError("Session expirée. Veuillez recharger la page pour vous reconnecter.");
        } else {
          setError(`Erreur lors du chargement des produits: ${err.response?.status} ${err.response?.statusText}`);
        }
      } else {
        console.error("❌ Erreur lors du chargement des produits inattendue :", err);
        setError("Une erreur inattendue s'est produite lors du chargement des produits.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchFournisseurs = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getFournisseurs(token);
      setFournisseurs(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des fournisseurs:", err);
    }
  }, [token]);

  const fetchSaisons = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getSaisons(token);
      setSaisons(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement des saisons:', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProduits();
      fetchFournisseurs();
      fetchSaisons();
    }
  }, [token, fetchProduits, fetchFournisseurs, fetchSaisons]);

  const handleProduitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Pas de token d'authentification.");
      return;
    }

    try {
      const dataToSend = {
        ...produitFormData,
        prix: parseFloat(produitFormData.prix),
        stock_actuel: parseInt(produitFormData.stock_actuel),
        fournisseur: parseInt(produitFormData.fournisseur),
        date_lancement: produitFormData.date_lancement || null,
        saisons: produitFormData.saisons
      };

      if (editingProduit) {
        await updateProduit(editingProduit.id, dataToSend, token);
      } else {
        await createProduit(dataToSend, token);
      }
      
      fetchProduits();
      setShowProduitForm(false);
      setEditingProduit(null);
    setProduitFormData({
      nom: '',
      categorie: '',
      fournisseur: '',
      prix: '',
        stock_actuel: '',
        description: '',
        date_lancement: '',
        statut: 'actif',
        saisons: []
      });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error("Erreur lors de l'opération sur le produit :", err);
        setError("Erreur lors de l'enregistrement du produit. Veuillez réessayer.");
      } else {
        console.error("Erreur lors de l'opération sur le produit inattendue :", err);
        setError("Une erreur inattendue s'est produite lors de l'enregistrement du produit.");
      }
    }
  };

  const handleEditProduit = (produit: Produit) => {
    setEditingProduit(produit);
    setProduitFormData({
      nom: produit.nom,
      categorie: produit.categorie,
      fournisseur: produit.fournisseur.toString(),
      prix: produit.prix.toString(),
      stock_actuel: produit.stock_actuel.toString(),
      description: produit.description || '',
      date_lancement: produit.date_lancement || '',
      statut: produit.statut,
      saisons: produit.saisons || []
    });
    setShowProduitForm(true);
  };

  const handleDeleteProduit = async (id: number) => {
    if (!token) {
      setError("Pas de token d'authentification.");
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduit(id, token);
        fetchProduits();
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error("Erreur lors de la suppression du produit :", err);
          setError("Erreur lors de la suppression du produit. Veuillez réessayer.");
        } else {
          console.error("Erreur lors de la suppression du produit inattendue :", err);
          setError("Une erreur inattendue s'est produite lors de la suppression du produit.");
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProduitFormData({
      ...produitFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaisonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => parseInt(opt.value));
    setProduitFormData({
      ...produitFormData,
      saisons: selected
    });
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'inactif':
        return 'bg-gray-100 text-gray-800';
      case 'fin_de_vie':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'Actif';
      case 'inactif':
        return 'Inactif';
      case 'fin_de_vie':
        return 'Fin de vie';
      default:
        return statut;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) return <div className="text-center text-gray-600">Chargement des produits...</div>;
  if (error) return <div className="text-center text-red-600">Erreur: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
          <p className="text-gray-600">Gérez votre catalogue de produits et leur stock</p>
        </div>
        <button 
          onClick={() => setShowProduitForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau produit</span>
        </button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showProduitForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingProduit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h3>
          <form onSubmit={handleProduitSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
              <input
                type="text"
                name="nom"
                value={produitFormData.nom}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                name="categorie"
                value={produitFormData.categorie}
                onChange={handleInputChange}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <select
                name="fournisseur"
                value={produitFormData.fournisseur}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un fournisseur</option>
                {fournisseurs.map((fournisseur) => (
                  <option key={fournisseur.id} value={fournisseur.id}>
                    {fournisseur.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                name="prix"
                value={produitFormData.prix}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock actuel</label>
              <input
                type="number"
                name="stock_actuel"
                value={produitFormData.stock_actuel}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                name="statut"
                value={produitFormData.statut}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="fin_de_vie">Fin de vie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de lancement</label>
              <input
                type="date"
                name="date_lancement"
                value={produitFormData.date_lancement}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saisons</label>
              <select
                multiple
                name="saisons"
                value={produitFormData.saisons.map(String)}
                onChange={handleSaisonChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {saisons.map((saison) => (
                  <option key={saison.id} value={saison.id}>{saison.nom}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Astuce: utilisez Ctrl/Cmd pour sélectionner plusieurs saisons</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={produitFormData.description}
                onChange={handleInputChange}
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
                    stock_actuel: '',
                    description: '',
                    date_lancement: '',
                    statut: 'actif',
                    saisons: []
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

      {/* Tableau des produits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des produits</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saisons
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
                    <div className="text-sm font-medium text-gray-900">{produit.nom}</div>
                    {produit.description && (
                      <div className="text-sm text-gray-500">{produit.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {fournisseurs.find(f => f.id === produit.fournisseur)?.nom || 'Fournisseur inconnu'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {produit.categorie}
                        </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(produit.prix)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{produit.stock_actuel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(produit.statut)}`}>
                      {getStatutLabel(produit.statut)}
                        </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {produit.saisons && produit.saisons.length > 0 ? (
                        produit.saisons.map((sid) => {
                          const s = saisons.find(x => x.id === sid);
                          return s ? (
                            <span key={sid} className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              {s.nom}
                            </span>
                          ) : null;
                        })
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                      onClick={() => handleEditProduit(produit)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduit(produit.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
      </div>
    </div>
  );
};

export default Produits;