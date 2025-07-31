import React, { useState } from 'react';
import { 
  Truck, 
  User, 
  Package, 
  RotateCcw, 
  Edit, 
  CreditCard, 
  Banknote,
  Search,
  Filter,
  Eye,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
  Plus
} from 'lucide-react';

const GestionLivraison: React.FC = () => {
  const [activeTab, setActiveTab] = useState('livreurs');
  const [selectedLivreur, setSelectedLivreur] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'livreurs', name: 'Livreurs', icon: User },
    { id: 'livraison', name: 'Livraison', icon: Truck },
    { id: 'retours', name: 'Retours', icon: RotateCcw },
    { id: 'changements', name: 'Changements', icon: Edit },
    { id: 'encaissement', name: 'Encaissement', icon: CreditCard },
  ];

  const [livreurs] = useState([
    {
      id: 1,
      nom: 'Martin Dubois',
      telephone: '+33 6 12 34 56 78',
      email: 'martin.dubois@codsuite.com',
      dateEmbauche: '2023-01-15',
      totalCommandes: 156,
      commandesLivrees: [
        {
          id: 'CMD-001',
          client: 'Entreprise ABC',
          adresse: '123 Rue de la Paix, Paris',
          dateLivraison: '2024-02-15',
          tempsMis: '45 min',
          statut: 'Livrée'
        },
        {
          id: 'CMD-002',
          client: 'Société XYZ',
          adresse: '456 Avenue des Champs, Lyon',
          dateLivraison: '2024-02-14',
          tempsMis: '1h 20min',
          statut: 'Livrée'
        }
      ]
    },
    {
      id: 2,
      nom: 'Sophie Bernard',
      telephone: '+33 6 98 76 54 32',
      email: 'sophie.bernard@codsuite.com',
      dateEmbauche: '2023-03-10',
      totalCommandes: 89,
      commandesLivrees: [
        {
          id: 'CMD-003',
          client: 'StartUp Tech',
          adresse: '789 Boulevard Innovation, Marseille',
          dateLivraison: '2024-02-13',
          tempsMis: '35 min',
          statut: 'Livrée'
        }
      ]
    }
  ]);

  const [livraisons] = useState([
    {
      id: 'CMD-004',
      client: 'Client A',
      adresse: '123 Rue Example, Paris',
      datePrevue: '2024-02-20',
      statut: 'À faire',
      livreur: null,
      montant: 150.00
    },
    {
      id: 'CMD-005',
      client: 'Client B',
      adresse: '456 Avenue Test, Lyon',
      datePrevue: '2024-02-18',
      statut: 'En cours',
      livreur: 'Martin Dubois',
      montant: 89.50
    },
    {
      id: 'CMD-006',
      client: 'Client C',
      adresse: '789 Boulevard Demo, Marseille',
      datePrevue: '2024-02-15',
      statut: 'Effectuée',
      livreur: 'Sophie Bernard',
      montant: 245.00
    }
  ]);

  const [retours] = useState([
    {
      id: 'RET-001',
      commande: 'CMD-010',
      client: 'Client Retour',
      motif: 'Produit défectueux',
      dateRetour: '2024-02-10',
      statut: 'Retourné',
      commentaire: 'Emballage endommagé lors du transport'
    },
    {
      id: 'ANN-001',
      commande: 'CMD-011',
      client: 'Client Annulation',
      motif: 'Annulation client',
      dateAnnulation: '2024-02-12',
      statut: 'Annulé',
      commentaire: 'Client a changé d\'avis avant livraison'
    }
  ]);

  const [changements] = useState([
    {
      id: 'CHG-001',
      commande: 'CMD-020',
      client: 'Client Modif',
      dateModification: '2024-02-14',
      modifications: 'Changement d\'adresse de livraison',
      avant: '123 Ancienne Rue, Paris',
      apres: '456 Nouvelle Avenue, Paris',
      commentaire: 'Déménagement du client'
    }
  ]);

  const [encaissements] = useState([
    {
      id: 'ENC-001',
      client: 'Client Espèces',
      montant: 125.50,
      methode: 'Espèces',
      date: '2024-02-15',
      livreur: 'Martin Dubois'
    },
    {
      id: 'ENC-002',
      client: 'Client Carte',
      montant: 89.00,
      methode: 'Carte',
      date: '2024-02-14',
      livreur: 'Sophie Bernard'
    }
  ]);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'À faire':
        return 'bg-red-100 text-red-800';
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'Effectuée':
      case 'Livrée':
        return 'bg-green-100 text-green-800';
      case 'Retourné':
        return 'bg-orange-100 text-orange-800';
      case 'Annulé':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const renderLivreurs = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Livreurs</h2>
          <p className="text-gray-600">Liste de tous vos livreurs et leurs performances</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nouveau livreur</span>
        </button>
      </div>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un livreur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livreur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'embauche
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total commandes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {livreurs.filter(livreur => 
                searchTerm === '' || 
                livreur.nom.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((livreur) => (
                <tr key={livreur.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{livreur.nom}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{livreur.telephone}</div>
                    <div className="text-sm text-gray-500">{livreur.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(livreur.dateEmbauche).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {livreur.totalCommandes} commandes
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedLivreur(livreur)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal détail livreur */}
      {selectedLivreur && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Fiche détaillée - {selectedLivreur.nom}
              </h3>
              <button
                onClick={() => setSelectedLivreur(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Informations personnelles</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom :</span>
                    <span className="font-medium">{selectedLivreur.nom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Téléphone :</span>
                    <span className="font-medium">{selectedLivreur.telephone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email :</span>
                    <span className="font-medium">{selectedLivreur.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date d'embauche :</span>
                    <span className="font-medium">{new Date(selectedLivreur.dateEmbauche).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Statistiques</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total commandes :</span>
                    <span className="font-bold text-blue-600">{selectedLivreur.totalCommandes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commandes livrées :</span>
                    <span className="font-medium">{selectedLivreur.commandesLivrees.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Historique des livraisons</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedLivreur.commandesLivrees.map((commande: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{commande.id}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{commande.client}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{commande.adresse}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{commande.dateLivraison}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{commande.tempsMis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLivraison = () => {
    const livraisonsEffectuees = livraisons.filter(l => l.statut === 'Effectuée');
    const livraisonsEnCours = livraisons.filter(l => l.statut === 'En cours');
    const livraisonsAFaire = livraisons.filter(l => l.statut === 'À faire');

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Livraisons</h2>
          <p className="text-gray-600">Suivi de toutes vos livraisons</p>
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une livraison..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{livraisonsEffectuees.length}</p>
                <p className="text-sm text-green-700">Livraisons effectuées</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">{livraisonsEnCours.length}</p>
                <p className="text-sm text-yellow-700">Livraisons en cours</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-900">{livraisonsAFaire.length}</p>
                <p className="text-sm text-red-700">Livraisons à faire</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sections des livraisons */}
        <div className="space-y-6">
          {/* À faire */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <h3 className="text-lg font-semibold text-red-900">Livraisons à faire ({livraisonsAFaire.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date prévue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {livraisonsAFaire.map((livraison) => (
                    <tr key={livraison.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{livraison.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{livraison.client}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{livraison.adresse}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{livraison.datePrevue}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(livraison.montant)}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 hover:text-blue-900 text-sm">
                          Affecter livreur
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* En cours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
              <h3 className="text-lg font-semibold text-yellow-900">Livraisons en cours ({livraisonsEnCours.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livreur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date prévue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {livraisonsEnCours.map((livraison) => (
                    <tr key={livraison.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{livraison.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{livraison.client}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{livraison.livreur}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{livraison.datePrevue}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(livraison.montant)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Effectuées */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
              <h3 className="text-lg font-semibold text-green-900">Livraisons effectuées ({livraisonsEffectuees.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livreur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date prévue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {livraisonsEffectuees.map((livraison) => (
                    <tr key={livraison.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{livraison.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{livraison.client}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{livraison.livreur}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{livraison.datePrevue}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(livraison.montant)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRetours = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Retours</h2>
        <p className="text-gray-600">Commandes retournées et annulées</p>
      </div>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un retour..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motif</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commentaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {retours.filter(retour => 
                searchTerm === '' || 
                retour.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                retour.commande.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((retour) => (
                <tr key={retour.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{retour.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{retour.commande}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{retour.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{retour.motif}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {retour.dateRetour || retour.dateAnnulation}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(retour.statut)}`}>
                      {retour.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{retour.commentaire}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderChangements = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Changements</h2>
        <p className="text-gray-600">Modifications apportées aux commandes</p>
      </div>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un changement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modifications</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avant/Après</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {changements.filter(changement => 
                searchTerm === '' || 
                changement.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                changement.commande.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((changement) => (
                <tr key={changement.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{changement.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{changement.commande}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{changement.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{changement.dateModification}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{changement.modifications}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="text-red-600">Avant: {changement.avant}</div>
                      <div className="text-green-600">Après: {changement.apres}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEncaissement = () => {
    const paiementsEspeces = encaissements.filter(e => e.methode === 'Espèces');
    const paiementsCarte = encaissements.filter(e => e.methode === 'Carte');

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Encaissements</h2>
          <p className="text-gray-600">Suivi des paiements par méthode</p>
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un encaissement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Paiements en espèces */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                <Banknote className="w-5 h-5 mr-2" />
                Paiements en espèces ({paiementsEspeces.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livreur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paiementsEspeces.filter(paiement => 
                    searchTerm === '' || 
                    paiement.client.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((paiement) => (
                    <tr key={paiement.id}>
                      <td className="px-4 py-4 text-sm text-gray-900">{paiement.client}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(paiement.montant)}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{paiement.date}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{paiement.livreur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paiements par carte */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Paiements par carte ({paiementsCarte.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livreur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paiementsCarte.filter(paiement => 
                    searchTerm === '' || 
                    paiement.client.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((paiement) => (
                    <tr key={paiement.id}>
                      <td className="px-4 py-4 text-sm text-gray-900">{paiement.client}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(paiement.montant)}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{paiement.date}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{paiement.livreur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'livreurs':
        return renderLivreurs();
      case 'livraison':
        return renderLivraison();
      case 'retours':
        return renderRetours();
      case 'changements':
        return renderChangements();
      case 'encaissement':
        return renderEncaissement();
      default:
        return renderLivreurs();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion de Livraison</h1>
        <p className="text-gray-600">Gérez vos livreurs, livraisons et encaissements</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default GestionLivraison;