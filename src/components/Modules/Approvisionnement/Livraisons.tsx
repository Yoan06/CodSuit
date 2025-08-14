import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { getLivraisons, createLivraison, updateLivraison, deleteLivraison } from '../../../services/livraisonService';
import { getProduits } from '../../../services/produitService';

interface Produit {
  id: number;
  nom: string;
}

interface Livraison {
  id: number;
  numero_commande: string;
  produit: number;
  quantite: number;
  date_livraison: string;
  statut: 'a_livrer' | 'en_cours' | 'livree';
  niveau: 'en_transit' | 'en_douane' | 'livree';
  bon_livraison_numero?: string;
  livreur?: string;
  date_creation?: string;
}

const Livraisons: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingLivraison, setEditingLivraison] = useState<Livraison | null>(null);
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    numero_commande: '',
    produit: '',
    quantite: '',
    date_livraison: '',
    statut: 'a_livrer' as 'a_livrer' | 'en_cours' | 'livree',
    niveau: 'en_transit' as 'en_transit' | 'en_douane' | 'livree',
    bon_livraison_numero: '',
    livreur: ''
  });

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
      } catch (err) {
        console.error("Erreur d'authentification:", err);
        setError("Erreur d'authentification");
      }
    };
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) setToken(storedToken);
    else authenticate();
  }, []);

  // Récupération des données
  const fetchLivraisons = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getLivraisons(token);
      setLivraisons(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des livraisons:", err);
      setError("Erreur lors du chargement des livraisons.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchProduits = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getProduits(token);
      setProduits(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchLivraisons();
      fetchProduits();
    }
  }, [token, fetchLivraisons, fetchProduits]);

  // Ajout ou modification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const dataToSend = {
        ...formData,
        produit: parseInt(formData.produit),
        quantite: parseInt(formData.quantite),
        date_livraison: formData.date_livraison,
        statut: formData.statut,
        niveau: formData.niveau,
        bon_livraison_numero: formData.bon_livraison_numero || undefined,
        livreur: formData.livreur || undefined
      };
      if (editingLivraison) {
        await updateLivraison(editingLivraison.id, dataToSend, token);
      } else {
        await createLivraison(dataToSend, token);
      }
      fetchLivraisons();
      setShowForm(false);
      setEditingLivraison(null);
      setFormData({ numero_commande: '', produit: '', quantite: '', date_livraison: '', statut: 'a_livrer', niveau: 'en_transit', bon_livraison_numero: '', livreur: '' });
    } catch {
      setError("Erreur lors de l'enregistrement de la livraison.");
    }
  };

  const handleEdit = (livraison: Livraison) => {
    setEditingLivraison(livraison);
    setFormData({
      numero_commande: livraison.numero_commande,
      produit: livraison.produit.toString(),
      quantite: livraison.quantite.toString(),
      date_livraison: livraison.date_livraison,
      statut: livraison.statut,
      niveau: livraison.niveau,
      bon_livraison_numero: livraison.bon_livraison_numero || '',
      livreur: livraison.livreur || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (confirm('Supprimer cette livraison ?')) {
      try {
        await deleteLivraison(id, token);
        fetchLivraisons();
      } catch {
        setError("Erreur lors de la suppression de la livraison.");
      }
    }
  };



  if (loading) return <div className="text-center text-gray-600">Chargement...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Livraisons</h2>
          <p className="text-gray-600">Suivez et gérez toutes vos livraisons</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle livraison</span>
        </button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingLivraison ? 'Modifier' : 'Ajouter'} une livraison</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de commande</label>
              <input
                type="text"
                value={formData.numero_commande}
                onChange={e => setFormData({ ...formData, numero_commande: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
              <select
                value={formData.produit}
                onChange={e => setFormData({ ...formData, produit: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un produit</option>
                {produits.map((produit) => (
                  <option key={produit.id} value={produit.id}>{produit.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input
                type="number"
                value={formData.quantite}
                onChange={e => setFormData({ ...formData, quantite: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de livraison</label>
              <input
                type="date"
                value={formData.date_livraison}
                onChange={e => setFormData({ ...formData, date_livraison: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={(e) => setFormData({...formData, statut: e.target.value as 'a_livrer' | 'en_cours' | 'livree'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="a_livrer">À livrer</option>
                  <option value="en_cours">En cours</option>
                  <option value="livree">Livrée</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <select
                  name="niveau"
                  value={formData.niveau}
                  onChange={(e) => setFormData({...formData, niveau: e.target.value as 'en_transit' | 'en_douane' | 'livree'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en_transit">En transit</option>
                  <option value="en_douane">En douane</option>
                  <option value="livree">Livrée</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de bon de livraison</label>
              <input
                type="text"
                value={formData.bon_livraison_numero}
                onChange={e => setFormData({ ...formData, bon_livraison_numero: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Livreur</label>
              <input
                type="text"
                value={formData.livreur}
                onChange={e => setFormData({ ...formData, livreur: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingLivraison ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingLivraison(null); setFormData({ numero_commande: '', produit: '', quantite: '', date_livraison: '', statut: 'a_livrer', niveau: 'en_transit', bon_livraison_numero: '', livreur: '' }); }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des livraisons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de livraison</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {livraisons.map((livraison) => (
                <tr key={livraison.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{livraison.numero_commande}</h3>
                        <p className="text-sm text-gray-600">{produits.find(p => p.id === livraison.produit)?.nom || 'Produit inconnu'}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          livraison.statut === 'livree' ? 'bg-green-100 text-green-800' :
                          livraison.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {livraison.statut === 'livree' ? 'Livrée' :
                           livraison.statut === 'en_cours' ? 'En cours' :
                           'À livrer'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          livraison.niveau === 'livree' ? 'bg-green-100 text-green-800' :
                          livraison.niveau === 'en_douane' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {livraison.niveau === 'livree' ? 'Livrée' :
                           livraison.niveau === 'en_douane' ? 'En douane' :
                           'En transit'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{livraison.quantite}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(livraison.date_livraison).toLocaleDateString('fr-FR')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{livraison.livreur || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleEdit(livraison)}>Modifier</button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(livraison.id)}>Supprimer</button>
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

export default Livraisons;