import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, MapPin, Phone, Mail, Globe, Building } from 'lucide-react';

interface Entreprise {
  id: number;
  nom: string;
  raisonSociale: string;
  siret: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  secteurActivite: string;
  typeEntreprise: string;
  dateCreation: string;
  statut: 'Active' | 'Inactive' | 'En attente';
  chiffresAffaires?: number;
  nombreEmployes?: number;
  siteWeb?: string;
}

const GestionEntreprise: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEntreprise, setEditingEntreprise] = useState<Entreprise | null>(null);
  const [entreprises, setEntreprises] = useState<Entreprise[]>([
    {
      id: 1,
      nom: 'TechnoSupply SARL',
      raisonSociale: 'TechnoSupply Société à Responsabilité Limitée',
      siret: '12345678901234',
      email: 'contact@technosupply.com',
      telephone: '+33 1 23 45 67 89',
      adresse: '123 Rue de la Tech',
      ville: 'Paris',
      codePostal: '75001',
      pays: 'France',
      secteurActivite: 'Technologie',
      typeEntreprise: 'Fournisseur',
      dateCreation: '2020-01-15',
      statut: 'Active',
      chiffresAffaires: 2500000,
      nombreEmployes: 45,
      siteWeb: 'https://technosupply.com'
    },
    {
      id: 2,
      nom: 'GlobalParts Ltd',
      raisonSociale: 'GlobalParts Limited Company',
      siret: '98765432109876',
      email: 'orders@globalparts.com',
      telephone: '+33 1 98 76 54 32',
      adresse: '456 Avenue des Pièces',
      ville: 'Lyon',
      codePostal: '69000',
      pays: 'France',
      secteurActivite: 'Commerce',
      typeEntreprise: 'Distributeur',
      dateCreation: '2018-06-10',
      statut: 'Active',
      chiffresAffaires: 1800000,
      nombreEmployes: 28
    }
  ]);

  const [formData, setFormData] = useState<Partial<Entreprise>>({
    nom: '',
    raisonSociale: '',
    siret: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'France',
    secteurActivite: '',
    typeEntreprise: '',
    statut: 'Active',
    chiffresAffaires: 0,
    nombreEmployes: 0,
    siteWeb: ''
  });

  const secteursActivite = [
    'Technologie',
    'Commerce',
    'Industrie',
    'Services',
    'Agriculture',
    'Construction',
    'Transport',
    'Santé',
    'Éducation',
    'Finance'
  ];

  const typesEntreprise = [
    'Fournisseur',
    'Client',
    'Distributeur',
    'Partenaire',
    'Sous-traitant',
    'Concurrent'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEntreprise) {
      setEntreprises(entreprises.map(ent => 
        ent.id === editingEntreprise.id 
          ? { ...editingEntreprise, ...formData, dateCreation: editingEntreprise.dateCreation }
          : ent
      ));
      setEditingEntreprise(null);
    } else {
      const newEntreprise: Entreprise = {
        id: entreprises.length + 1,
        ...formData as Entreprise,
        dateCreation: new Date().toISOString().split('T')[0]
      };
      setEntreprises([...entreprises, newEntreprise]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      raisonSociale: '',
      siret: '',
      email: '',
      telephone: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: 'France',
      secteurActivite: '',
      typeEntreprise: '',
      statut: 'Active',
      chiffresAffaires: 0,
      nombreEmployes: 0,
      siteWeb: ''
    });
    setShowForm(false);
    setEditingEntreprise(null);
  };

  const handleEdit = (entreprise: Entreprise) => {
    setEditingEntreprise(entreprise);
    setFormData(entreprise);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
      setEntreprises(entreprises.filter(ent => ent.id !== id));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'chiffresAffaires' || name === 'nombreEmployes' ? Number(value) : value
    });
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion d'Entreprise</h1>
        <p className="text-gray-600">Gérez vos partenaires commerciaux et entreprises</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Liste des Entreprises</h2>
            <p className="text-gray-600">Gérez vos partenaires et entreprises</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle entreprise</span>
          </button>
        </div>

        {/* Formulaire d'ajout/modification */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingEntreprise ? 'Modifier l\'entreprise' : 'Ajouter une nouvelle entreprise'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Raison sociale *</label>
                <input
                  type="text"
                  name="raisonSociale"
                  value={formData.raisonSociale}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SIRET *</label>
                <input
                  type="text"
                  name="siret"
                  value={formData.siret}
                  onChange={handleInputChange}
                  required
                  maxLength={14}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                <input
                  type="url"
                  name="siteWeb"
                  value={formData.siteWeb}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code postal *</label>
                <input
                  type="text"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleInputChange}
                  required
                  maxLength={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                <input
                  type="text"
                  name="pays"
                  value={formData.pays}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d'activité *</label>
                <select
                  name="secteurActivite"
                  value={formData.secteurActivite}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un secteur</option>
                  {secteursActivite.map((secteur) => (
                    <option key={secteur} value={secteur}>{secteur}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type d'entreprise *</label>
                <select
                  name="typeEntreprise"
                  value={formData.typeEntreprise}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un type</option>
                  {typesEntreprise.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chiffre d'affaires (€)</label>
                <input
                  type="number"
                  name="chiffresAffaires"
                  value={formData.chiffresAffaires}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'employés</label>
                <input
                  type="number"
                  name="nombreEmployes"
                  value={formData.nombreEmployes}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="En attente">En attente</option>
                </select>
              </div>

              <div className="lg:col-span-3 flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingEntreprise ? 'Modifier' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Barre de recherche */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher une entreprise..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtrer</span>
          </button>
        </div>

        {/* Liste des entreprises */}
        <div className="grid gap-6">
          {entreprises.map((entreprise) => (
            <div key={entreprise.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <Building className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">{entreprise.nom}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(entreprise.statut)}`}>
                      {entreprise.statut}
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {entreprise.typeEntreprise}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Raison sociale</p>
                      <p className="font-medium text-gray-900">{entreprise.raisonSociale}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">SIRET</p>
                      <p className="font-medium text-gray-900 font-mono">{entreprise.siret}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Secteur d'activité</p>
                      <p className="font-medium text-gray-900">{entreprise.secteurActivite}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">{entreprise.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="text-sm font-medium text-gray-900">{entreprise.telephone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Localisation</p>
                        <p className="text-sm font-medium text-gray-900">{entreprise.ville}, {entreprise.pays}</p>
                      </div>
                    </div>
                    {entreprise.siteWeb && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Site web</p>
                          <a href={entreprise.siteWeb} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Visiter
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-700">Chiffre d'affaires</p>
                      <p className="text-lg font-bold text-green-900">{formatCurrency(entreprise.chiffresAffaires)}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-700">Employés</p>
                      <p className="text-lg font-bold text-blue-900">{entreprise.nombreEmployes || 'N/A'}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-700">Créée le</p>
                      <p className="text-lg font-bold text-purple-900">
                        {new Date(entreprise.dateCreation).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => handleEdit(entreprise)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(entreprise.id)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GestionEntreprise;