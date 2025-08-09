import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { getFournisseurs, createFournisseur, updateFournisseur, deleteFournisseur, login } from '../../../services/fournisseurService';
import { AxiosError } from 'axios';

interface Fournisseur {
  id: number;
  nom: string;
  email: string;
  telephone?: string; // Optionnel
  adresse?: string; // Optionnel
  ville?: string; // Optionnel
  pays?: string; // Optionnel
  date_ajout?: string; // Géré par le backend
}

const GestionFournisseurs: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingFournisseur, setEditingFournisseur] = useState<Fournisseur | null>(null);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    pays: '',
  });
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function pour vérifier si une erreur est une AxiosError
  const isAxiosError = (err: unknown): err is AxiosError => {
    return (err as AxiosError).isAxiosError === true;
  };

  // Gérer l'authentification (pour le test, à remplacer par un contexte d'auth global)
  useEffect(() => {
    const authenticate = async () => {
      console.log('🔐 Tentative d\'authentification...');
      try {
        // Utilise des identifiants de test ou récupère-les de façon sécurisée
        console.log('📡 Envoi de la requête d\'authentification...');
        const res = await login('yoan', 'test12345'); // Utilisateur 'yoan' avec mot de passe 'test12345'
        console.log('✅ Authentification réussie:', res.data);
        setToken(res.data.access);
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error("❌ Erreur d'authentification :", err);
          console.error("Détails de l'erreur:", err.response?.data || err.message);
          setError("Impossible de s'authentifier. Vérifiez le backend et les identifiants.");
        } else {
          console.error("❌ Erreur d'authentification inattendue :", err);
          setError("Une erreur inattendue s'est produite lors de l'authentification.");
        }
      }
    };
    authenticate();
  }, []);

  const fetchFournisseurs = useCallback(async () => {
    if (!token) {
      console.log('🚫 Pas de token disponible pour récupérer les fournisseurs');
      return;
    }
    console.log('📡 Récupération des fournisseurs avec le token:', token.substring(0, 20) + '...');
    setLoading(true);
    setError(null);
    try {
      const res = await getFournisseurs(token);
      console.log('✅ Fournisseurs récupérés:', res.data);
      setFournisseurs(res.data);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error("❌ Erreur lors du chargement des fournisseurs :", err);
        console.error("Détails de l'erreur:", err.response?.data || err.message);
        setError("Erreur lors du chargement des fournisseurs. Veuillez réessayer.");
      } else {
        console.error("❌ Erreur lors du chargement des fournisseurs inattendue :", err);
        setError("Une erreur inattendue s'est produite lors du chargement des fournisseurs.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]); // token est une dépendance de fetchFournisseurs

  useEffect(() => {
    if (token) {
      fetchFournisseurs();
    }
  }, [token, fetchFournisseurs]); // Ajout de fetchFournisseurs ici

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Pas de token d'authentification.");
      return;
    }

    try {
      if (editingFournisseur) {
        await updateFournisseur(editingFournisseur.id, formData, token);
      } else {
        await createFournisseur(formData, token);
      }
      // Recharger la liste après succès
      fetchFournisseurs();
      setShowForm(false);
      setEditingFournisseur(null);
      setFormData({ nom: '', email: '', telephone: '', adresse: '', ville: '', pays: '' });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error("Erreur lors de l'opération sur le fournisseur :", err);
        setError("Erreur lors de l'enregistrement du fournisseur. Veuillez réessayer.");
      } else {
        console.error("Erreur lors de l'opération sur le fournisseur inattendue :", err);
        setError("Une erreur inattendue s'est produite lors de l'enregistrement du fournisseur.");
      }
    }
  };

  const handleEdit = (fournisseur: Fournisseur) => {
    setEditingFournisseur(fournisseur);
    setFormData({
      nom: fournisseur.nom,
      email: fournisseur.email,
      telephone: fournisseur.telephone || '',
      adresse: fournisseur.adresse || '',
      ville: fournisseur.ville || '',
      pays: fournisseur.pays || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setError("Pas de token d'authentification.");
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      try {
        await deleteFournisseur(id, token);
        fetchFournisseurs(); // Recharger la liste après suppression
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error("Erreur lors de la suppression du fournisseur :", err);
          setError("Erreur lors de la suppression du fournisseur. Veuillez réessayer.");
        } else {
          console.error("Erreur lors de la suppression du fournisseur inattendue :", err);
          setError("Une erreur inattendue s'est produite lors de la suppression du fournisseur.");
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="text-center text-gray-600">Chargement des fournisseurs...</div>;
  if (error) return <div className="text-center text-red-600">Erreur: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Fournisseurs</h2>
          <p className="text-gray-600">Gérez vos partenaires et leurs performances</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau fournisseur</span>
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingFournisseur ? 'Modifier le fournisseur' : 'Ajouter un nouveau fournisseur'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du fournisseur</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
              <input
                type="text"
                name="pays"
                value={formData.pays}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingFournisseur ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingFournisseur(null);
                  setFormData({ nom: '', email: '', telephone: '', adresse: '', ville: '', pays: '' });
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
            placeholder="Rechercher un fournisseur..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filtrer</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'ajout
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fournisseurs.map((fournisseur) => (
                <tr key={fournisseur.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{fournisseur.nom}</div>
                      <div className="text-sm text-gray-500">{fournisseur.adresse}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{fournisseur.email}</div>
                    <div className="text-sm text-gray-500">{fournisseur.telephone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{fournisseur.ville}, {fournisseur.pays}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {fournisseur.date_ajout ? new Date(fournisseur.date_ajout).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(fournisseur)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(fournisseur.id)}
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

export default GestionFournisseurs;