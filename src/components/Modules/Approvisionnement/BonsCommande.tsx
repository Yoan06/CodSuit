import React, { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, Calendar } from 'lucide-react';
import { getBonsCommande, createBonCommande, updateBonCommande, deleteBonCommande } from '../../../services/bonCommandeService';
import { getFournisseurs } from '../../../services/fournisseurService';
import { getProduits } from '../../../services/produitService';

interface Fournisseur {
  id: number;
  nom: string;
}

interface Produit {
  id: number;
  nom: string;
}

interface BonCommande {
  id: number;
  numero: string;
  produit: number;
  fournisseur: number;
  date_debut: string;
  date_fin: string;
  quantite: number;
  prix_unitaire: number;
  statut: 'a_envoyer' | 'envoyee' | 'recue' | 'annulee';
  date_creation?: string;
}

const BonsCommande: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBon, setEditingBon] = useState<BonCommande | null>(null);
  const [bonsCommande, setBonsCommande] = useState<BonCommande[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    numero: '',
    produit: '',
    fournisseur: '',
    date_debut: '',
    date_fin: '',
    quantite: '',
    prix_unitaire: '',
    statut: 'a_envoyer' as 'a_envoyer' | 'envoyee' | 'recue' | 'annulee',
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
  const fetchBonsCommande = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getBonsCommande(token);
      setBonsCommande(res.data);
    } catch (err: unknown) {
      console.error("Erreur lors du chargement des bons de commande:", err);
      setError("Erreur lors du chargement des bons de commande.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchFournisseurs = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getFournisseurs(token);
      setFournisseurs(res.data);
    } catch (err: unknown) {
      console.error("Erreur lors du chargement des fournisseurs:", err);
    }
  }, [token]);

  const fetchProduits = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getProduits(token);
      setProduits(res.data);
    } catch (err: unknown) {
      console.error("Erreur lors du chargement des produits:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchBonsCommande();
      fetchFournisseurs();
      fetchProduits();
    }
  }, [token, fetchBonsCommande, fetchFournisseurs, fetchProduits]);

  // Ajout ou modification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const dataToSend = {
        ...formData,
        produit: parseInt(formData.produit),
        fournisseur: parseInt(formData.fournisseur),
        quantite: parseInt(formData.quantite),
        prix_unitaire: parseFloat(formData.prix_unitaire),
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
        statut: formData.statut,
      };
      if (editingBon) {
        await updateBonCommande(editingBon.id, dataToSend, token);
      } else {
        await createBonCommande(dataToSend, token);
      }
      fetchBonsCommande();
      setShowForm(false);
      setEditingBon(null);
      setFormData({ numero: '', produit: '', fournisseur: '', date_debut: '', date_fin: '', quantite: '', prix_unitaire: '', statut: 'a_envoyer' });
    } catch {
      setError("Erreur lors de l'enregistrement du bon de commande.");
    }
  };

  const handleEdit = (bon: BonCommande) => {
    setEditingBon(bon);
    setFormData({
      numero: bon.numero,
      produit: bon.produit.toString(),
      fournisseur: bon.fournisseur.toString(),
      date_debut: bon.date_debut,
      date_fin: bon.date_fin,
      quantite: bon.quantite.toString(),
      prix_unitaire: bon.prix_unitaire.toString(),
      statut: bon.statut
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (confirm('Supprimer ce bon de commande ?')) {
      try {
        await deleteBonCommande(id, token);
        fetchBonsCommande();
      } catch {
        setError("Erreur lors de la suppression du bon de commande.");
      }
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'envoyee': return 'bg-blue-100 text-blue-800';
      case 'recue': return 'bg-green-100 text-green-800';
      case 'annulee': return 'bg-red-100 text-red-800';
      case 'a_envoyer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  if (loading) return <div className="text-center text-gray-600">Chargement...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  const commandesAEnvoyer = bonsCommande.filter(cmd => cmd.statut === 'a_envoyer');
  const commandesEnvoyees = bonsCommande.filter(cmd => cmd.statut === 'envoyee' || cmd.statut === 'recue');

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

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingBon ? 'Modifier' : 'Ajouter'} un bon de commande</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro</label>
              <input
                type="text"
                value={formData.numero}
                onChange={e => setFormData({ ...formData, numero: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <select
                value={formData.fournisseur}
                onChange={e => setFormData({ ...formData, fournisseur: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un fournisseur</option>
                {fournisseurs.map((f) => (
                  <option key={f.id} value={f.id}>{f.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                value={formData.date_debut}
                onChange={e => setFormData({ ...formData, date_debut: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                value={formData.date_fin}
                onChange={e => setFormData({ ...formData, date_fin: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire</label>
              <input
                type="number"
                step="0.01"
                value={formData.prix_unitaire}
                onChange={e => setFormData({ ...formData, prix_unitaire: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={formData.statut}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, statut: e.target.value as BonCommande['statut'] })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="a_envoyer">À envoyer</option>
                <option value="envoyee">Envoyée</option>
                <option value="recue">Reçue</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingBon ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingBon(null); setFormData({ numero: '', produit: '', fournisseur: '', date_debut: '', date_fin: '', quantite: '', prix_unitaire: '', statut: 'a_envoyer' }); }}
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
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{produits.find(p => p.id === commande.produit)?.nom || 'Produit inconnu'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fournisseurs.find(f => f.id === commande.fournisseur)?.nom || 'Fournisseur inconnu'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {new Date(commande.date_debut).toLocaleDateString('fr-FR')} - {new Date(commande.date_fin).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{commande.quantite}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{formatCurrency(commande.quantite * commande.prix_unitaire)}</td>
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleEdit(commande)}>Modifier</button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(commande.id)}>Supprimer</button>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fournisseur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {commandesEnvoyees.map((commande) => (
                <tr key={commande.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{produits.find(p => p.id === commande.produit)?.nom || 'Produit inconnu'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fournisseurs.find(f => f.id === commande.fournisseur)?.nom || 'Fournisseur inconnu'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {new Date(commande.date_debut).toLocaleDateString('fr-FR')} - {new Date(commande.date_fin).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{commande.quantite}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{formatCurrency(commande.quantite * commande.prix_unitaire)}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(commande.statut)}`}>{commande.statut}</span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleEdit(commande)}>Modifier</button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(commande.id)}>Supprimer</button>
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

export default BonsCommande;