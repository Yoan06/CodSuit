import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, CheckCircle, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { getEcheances, createEcheance, updateEcheance, deleteEcheance } from '../../../services/echeanceService';
import { getFournisseurs } from '../../../services/fournisseurService';
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

interface Echeance {
  id: number;
  titre: string;
  description?: string;
  date_echeance: string;
  montant?: number;
  statut: 'en_attente' | 'paye' | 'retard' | 'annule';
  fournisseur?: number;
  date_ajout?: string;
}

const Echeances: React.FC = () => {
  const [echeances, setEcheances] = useState<Echeance[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEcheance, setEditingEcheance] = useState<Echeance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_echeance: '',
    montant: '',
    statut: 'en_attente' as 'en_attente' | 'paye' | 'retard' | 'annule',
    fournisseur: ''
  });

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

  const fetchEcheances = useCallback(async () => {
    if (!token) {
      console.log('🚫 Pas de token disponible pour récupérer les échéances');
      return;
    }
    console.log('📡 Récupération des échéances avec le token:', token.substring(0, 20) + '...');
    setLoading(true);
    setError(null);
    try {
      const res = await getEcheances(token);
      console.log('✅ Échéances récupérées:', res.data);
      setEcheances(res.data);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error("❌ Erreur lors du chargement des échéances :", err);
        console.error("Status:", err.response?.status);
        console.error("Status Text:", err.response?.statusText);
        console.error("Détails de l'erreur:", err.response?.data || err.message);
        
        if (err.response?.status === 401) {
          console.log('🔑 Token expiré ou invalide, suppression du token...');
          localStorage.removeItem('authToken');
          setToken(null);
          setError("Session expirée. Veuillez recharger la page pour vous reconnecter.");
        } else {
          setError(`Erreur lors du chargement des échéances: ${err.response?.status} ${err.response?.statusText}`);
        }
      } else {
        console.error("❌ Erreur lors du chargement des échéances inattendue :", err);
        setError("Une erreur inattendue s'est produite lors du chargement des échéances.");
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

  useEffect(() => {
    if (token) {
      fetchEcheances();
      fetchFournisseurs();
    }
  }, [token, fetchEcheances, fetchFournisseurs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Pas de token d'authentification.");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        montant: formData.montant ? parseFloat(formData.montant) : null,
        fournisseur: formData.fournisseur ? parseInt(formData.fournisseur) : null
      };

      if (editingEcheance) {
        await updateEcheance(editingEcheance.id, dataToSend, token);
      } else {
        await createEcheance(dataToSend, token);
      }
      
      fetchEcheances();
      setShowForm(false);
      setEditingEcheance(null);
      setFormData({ titre: '', description: '', date_echeance: '', montant: '', statut: 'en_attente', fournisseur: '' });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error("Erreur lors de l'opération sur l'échéance :", err);
        setError("Erreur lors de l'enregistrement de l'échéance. Veuillez réessayer.");
      } else {
        console.error("Erreur lors de l'opération sur l'échéance inattendue :", err);
        setError("Une erreur inattendue s'est produite lors de l'enregistrement de l'échéance.");
      }
    }
  };

  const handleEdit = (echeance: Echeance) => {
    setEditingEcheance(echeance);
    setFormData({
      titre: echeance.titre,
      description: echeance.description || '',
      date_echeance: echeance.date_echeance,
      montant: echeance.montant?.toString() || '',
      statut: echeance.statut,
      fournisseur: echeance.fournisseur?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setError("Pas de token d'authentification.");
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cette échéance ?')) {
      try {
        await deleteEcheance(id, token);
        fetchEcheances();
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error("Erreur lors de la suppression de l'échéance :", err);
          setError("Erreur lors de la suppression de l'échéance. Veuillez réessayer.");
        } else {
          console.error("Erreur lors de la suppression de l'échéance inattendue :", err);
          setError("Une erreur inattendue s'est produite lors de la suppression de l'échéance.");
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'paye':
        return 'bg-green-100 text-green-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'retard':
        return 'bg-red-100 text-red-800';
      case 'annule':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'paye':
        return <CheckCircle className="w-4 h-4" />;
      case 'en_attente':
        return <Clock className="w-4 h-4" />;
      case 'retard':
        return <AlertTriangle className="w-4 h-4" />;
      case 'annule':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'paye':
        return 'Payé';
      case 'en_attente':
        return 'En attente';
      case 'retard':
        return 'En retard';
      case 'annule':
        return 'Annulé';
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

  const isDateOverdue = (date: string, statut: string) => {
    const today = new Date();
    const targetDate = new Date(date);
    return targetDate < today && statut !== 'paye';
  };

  const echeancesEnRetard = echeances.filter(e => e.statut === 'retard');
  const echeancesProches = echeances.filter(e => {
    const today = new Date();
    const dateEcheance = new Date(e.date_echeance);
    const diffTime = dateEcheance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0 && e.statut === 'en_attente';
  });

  if (loading) return <div className="text-center text-gray-600">Chargement des échéances...</div>;
  if (error) return <div className="text-center text-red-600">Erreur: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Échéances</h2>
          <p className="text-gray-600">Suivez vos échéances de paiement et planifiez vos commandes</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle échéance</span>
        </button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingEcheance ? 'Modifier l\'échéance' : 'Ajouter une nouvelle échéance'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
              <input
                type="date"
                name="date_echeance"
                value={formData.date_echeance}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
              <input
                type="number"
                step="0.01"
                name="montant"
                value={formData.montant}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en_attente">En attente</option>
                <option value="paye">Payé</option>
                <option value="retard">En retard</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur (optionnel)</label>
              <select
                name="fournisseur"
                value={formData.fournisseur}
                onChange={handleInputChange}
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
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
                {editingEcheance ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEcheance(null);
                  setFormData({ titre: '', description: '', date_echeance: '', montant: '', statut: 'en_attente', fournisseur: '' });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alertes */}
      {(echeancesEnRetard.length > 0 || echeancesProches.length > 0) && (
        <div className="space-y-3">
          {echeancesEnRetard.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">Échéances en retard ({echeancesEnRetard.length})</h3>
              </div>
              <div className="space-y-2">
                {echeancesEnRetard.map(echeance => (
                  <div key={echeance.id} className="flex justify-between items-center">
                    <span className="text-red-800">{echeance.titre}</span>
                    <span className="font-medium text-red-900">
                      {echeance.montant ? formatCurrency(echeance.montant) : 'Montant non défini'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {echeancesProches.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-900">Échéances à venir (7 jours) ({echeancesProches.length})</h3>
              </div>
              <div className="space-y-2">
                {echeancesProches.map(echeance => (
                  <div key={echeance.id} className="flex justify-between items-center">
                    <span className="text-yellow-800">{echeance.titre}</span>
                    <span className="font-medium text-yellow-900">
                      {echeance.montant ? formatCurrency(echeance.montant) : 'Montant non défini'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Liste détaillée des échéances */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Détail des échéances</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'échéance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
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
              {echeances.map((echeance) => (
                <tr 
                  key={echeance.id} 
                  className={`hover:bg-gray-50 ${
                    isDateOverdue(echeance.date_echeance, echeance.statut) ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{echeance.titre}</div>
                    {echeance.description && (
                      <div className="text-sm text-gray-500">{echeance.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {echeance.fournisseur 
                        ? fournisseurs.find(f => f.id === echeance.fournisseur)?.nom || 'Fournisseur inconnu'
                        : 'Aucun fournisseur'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      isDateOverdue(echeance.date_echeance, echeance.statut) 
                        ? 'text-red-600 font-medium' 
                        : 'text-gray-900'
                    }`}>
                      {new Date(echeance.date_echeance).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {echeance.montant ? formatCurrency(echeance.montant) : 'Non défini'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(echeance.statut)}`}>
                      {getStatutIcon(echeance.statut)}
                      <span>{getStatutLabel(echeance.statut)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(echeance)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(echeance.id)}
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

export default Echeances;