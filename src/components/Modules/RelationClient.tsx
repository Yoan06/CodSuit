import React, { useState } from 'react';
import { 
  Phone, 
  Award, 
  Target, 
  Users, 
  MessageCircle, 
  Send,
  Search,
  Filter,
  Plus,
  Star,
  Gift,
  TrendingUp,
  Calendar,
  Mail,
  Smartphone,
  Bot,
  Zap
} from 'lucide-react';

const RelationClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState('call-center');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'call-center', name: 'Call Center', icon: Phone },
    { id: 'fidelite', name: 'Programmes de Fidélité', icon: Award },
    { id: 'retargeting', name: 'Retargeting', icon: Target },
    { id: 'segmentation', name: 'Segmentation des Clients', icon: Users },
    { id: 'chatbot', name: 'Chatbot', icon: MessageCircle },
    { id: 'whatsapp', name: 'API WhatsApp', icon: Send },
  ];

  const [agents] = useState([
    {
      id: 1,
      nom: 'Marie Dupont',
      telephone: '+33 1 23 45 67 89',
      email: 'marie.dupont@codsuite.com',
      statut: 'Disponible',
      totalAppels: 245,
      appelsDuJour: 12
    },
    {
      id: 2,
      nom: 'Pierre Martin',
      telephone: '+33 1 98 76 54 32',
      email: 'pierre.martin@codsuite.com',
      statut: 'En appel',
      totalAppels: 189,
      appelsDuJour: 8
    }
  ]);

  const [appels] = useState([
    {
      id: 1,
      client: 'Client ABC',
      agent: 'Marie Dupont',
      date: '2024-02-15',
      heure: '14:30',
      duree: '12 min',
      commentaire: 'Demande d\'information sur les nouveaux produits',
      statut: 'Terminé'
    },
    {
      id: 2,
      client: 'Société XYZ',
      agent: 'Pierre Martin',
      date: '2024-02-15',
      heure: '15:45',
      duree: '8 min',
      commentaire: 'Réclamation sur délai de livraison',
      statut: 'Suivi requis'
    }
  ]);

  const [clients] = useState([
    {
      id: 1,
      nom: 'Client Premium',
      email: 'premium@example.com',
      niveau: 'Or',
      points: 2500,
      pointsUtilises: 500,
      totalAchats: 15000,
      derniereActivite: '2024-02-10',
      segment: 'Très actif'
    },
    {
      id: 2,
      nom: 'Client Standard',
      email: 'standard@example.com',
      niveau: 'Argent',
      points: 850,
      pointsUtilises: 200,
      totalAchats: 3500,
      derniereActivite: '2024-01-25',
      segment: 'Régulier'
    },
    {
      id: 3,
      nom: 'Client Occasionnel',
      email: 'occasionnel@example.com',
      niveau: 'Bronze',
      points: 120,
      pointsUtilises: 0,
      totalAchats: 450,
      derniereActivite: '2023-12-15',
      segment: 'Occasionnel'
    }
  ]);

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case 'Or':
        return 'bg-yellow-100 text-yellow-800';
      case 'Argent':
        return 'bg-gray-100 text-gray-800';
      case 'Bronze':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Très actif':
        return 'bg-green-100 text-green-800';
      case 'Régulier':
        return 'bg-blue-100 text-blue-800';
      case 'Occasionnel':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const renderCallCenter = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Call Center</h2>
          <p className="text-gray-600">Gestion des agents et historique des appels</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nouvel agent</span>
        </button>
      </div>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un agent ou un appel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Agents du call center */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Agents du Call Center</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appels du jour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total appels</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agents.filter(agent => 
                searchTerm === '' || 
                agent.nom.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((agent) => (
                <tr key={agent.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{agent.nom}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.telephone}</div>
                    <div className="text-sm text-gray-500">{agent.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      agent.statut === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agent.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.appelsDuJour}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.totalAppels}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historique des appels */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historique des Appels</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Heure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commentaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appels.filter(appel => 
                searchTerm === '' || 
                appel.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appel.agent.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((appel) => (
                <tr key={appel.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{appel.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{appel.agent}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{appel.date} {appel.heure}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{appel.duree}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{appel.commentaire}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appel.statut === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appel.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFidelite = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Programmes de Fidélité</h2>
          <p className="text-gray-600">Système de points et niveaux de fidélité</p>
        </div>
      </div>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Niveaux de fidélité */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8 text-orange-600" />
            <h3 className="text-xl font-semibold text-orange-900">Bronze</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-orange-700">0 - 999 points</p>
            <p className="text-sm text-orange-700">• 1 point = 1€ d'achat</p>
            <p className="text-sm text-orange-700">• Réduction 5% dès 100 points</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">Argent</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">1000 - 4999 points</p>
            <p className="text-sm text-gray-700">• Réduction 10%</p>
            <p className="text-sm text-gray-700">• Livraison gratuite</p>
            <p className="text-sm text-gray-700">• Support prioritaire</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8 text-yellow-600" />
            <h3 className="text-xl font-semibold text-yellow-900">Or</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-yellow-700">5000+ points</p>
            <p className="text-sm text-yellow-700">• Réduction 15%</p>
            <p className="text-sm text-yellow-700">• Cadeaux exclusifs</p>
            <p className="text-sm text-yellow-700">• Accès VIP</p>
          </div>
        </div>
      </div>

      {/* Liste des clients fidèles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Clients Fidèles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points utilisés</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total achats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière activité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.filter(client => 
                searchTerm === '' || 
                client.nom.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.nom}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getNiveauColor(client.niveau)}`}>
                      <Star className="w-3 h-3 mr-1" />
                      {client.niveau}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {client.points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.pointsUtilises}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(client.totalAchats)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(client.derniereActivite).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRetargeting = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Retargeting Marketing</h2>
        <p className="text-gray-600">Relances automatiques et suivi des conversions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-900">156</p>
              <p className="text-sm text-red-700">Paniers abandonnés</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">89</p>
              <p className="text-sm text-yellow-700">Emails envoyés</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <Smartphone className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">34</p>
              <p className="text-sm text-blue-700">SMS envoyés</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">23%</p>
              <p className="text-sm text-green-700">Taux conversion</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration des Campagnes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Délai de relance (heures)</label>
              <input type="number" defaultValue="24" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de relances max</label>
              <input type="number" defaultValue="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Canal de communication</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Email + SMS</option>
                <option>Email seulement</option>
                <option>SMS seulement</option>
              </select>
            </div>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Sauvegarder la configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSegmentation = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Segmentation des Clients</h2>
        <p className="text-gray-600">Classification par fréquence d'achat</p>
      </div>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">1</p>
              <p className="text-sm text-green-700">Clients très actifs</p>
            </div>
          </div>
          <p className="text-sm text-green-600">Achats  5000€/an</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">1</p>
              <p className="text-sm text-blue-700">Clients réguliers</p>
            </div>
          </div>
          <p className="text-sm text-blue-600">1000€ - 5000€/an</p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">1</p>
              <p className="text-sm text-yellow-700">Clients occasionnels</p>
            </div>
          </div>
          <p className="text-sm text-yellow-600">{'< '}1000€/an</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des Clients par Segment</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total achats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière activité</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.filter(client => 
                searchTerm === '' || 
                client.nom.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.nom}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(client.segment)}`}>
                      {client.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(client.totalAchats)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(client.derniereActivite).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-blue-600 hover:text-blue-900 text-sm">
                      Envoyer campagne
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

  const renderChatbot = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Interface Chatbot</h2>
        <p className="text-gray-600">Configuration du chatbot client (inactif)</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Chatbot en préparation</h3>
        <p className="text-gray-600 mb-6">
          L'interface de chatbot sera bientôt disponible avec dialogue automatisé et réponses intelligentes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Fonctionnalités prévues</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Réponses automatiques FAQ</li>
              <li>• Prise de commande assistée</li>
              <li>• Support client 24/7</li>
              <li>• Intégration avec la base clients</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Configuration</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Messages de bienvenue</li>
              <li>• Scénarios de conversation</li>
              <li>• Transfert vers agents</li>
              <li>• Analyse des interactions</li>
            </ul>
          </div>
        </div>
        
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors" disabled>
          Configuration (Bientôt disponible)
        </button>
      </div>
    </div>
  );

  const renderWhatsApp = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">API WhatsApp</h2>
        <p className="text-gray-600">Campagnes automatisées WhatsApp (en préparation)</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Intégration WhatsApp Business</h3>
        <p className="text-gray-600 mb-6">
          Module en développement pour l'intégration complète de l'API WhatsApp Business.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-50 p-4 rounded-lg">
            <Send className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Gestion de contacts</h4>
            <p className="text-sm text-gray-600">
              Import et organisation des contacts clients pour les campagnes WhatsApp.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Messages en masse</h4>
            <p className="text-sm text-gray-600">
              Envoi de messages promotionnels et informatifs à grande échelle.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Campagnes automatiques</h4>
            <p className="text-sm text-gray-600">
              Planification et automatisation des campagnes marketing.
            </p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note :</strong> L'intégration WhatsApp Business API nécessite une validation Meta et sera activée ultérieurement.
          </p>
        </div>
        
        <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors" disabled>
          Configuration API (Prochainement)
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'call-center':
        return renderCallCenter();
      case 'fidelite':
        return renderFidelite();
      case 'retargeting':
        return renderRetargeting();
      case 'segmentation':
        return renderSegmentation();
      case 'chatbot':
        return renderChatbot();
      case 'whatsapp':
        return renderWhatsApp();
      default:
        return renderCallCenter();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion de la Relation Client</h1>
        <p className="text-gray-600">Communication, fidélisation et marketing client</p>
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

export default RelationClient;