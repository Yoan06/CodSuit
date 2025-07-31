import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Clock, 
  Calendar, 
  Award, 
  UserCheck,
  Plus,
  Search,
  Filter,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Download,
  Eye,
  ChevronRight,
  Building2
} from 'lucide-react';

const GestionRH: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agents');

  const tabs = [
    { id: 'agents', name: 'Agents', icon: Users },
    { id: 'paie', name: 'Gestion de la Paie', icon: DollarSign },
    { id: 'assiduite', name: 'Gestion de l\'Assiduité', icon: Clock },
    { id: 'conges', name: 'Gestion des Congés', icon: Calendar },
    { id: 'performance', name: 'Gestion de la Performance', icon: Award },
    { id: 'roles', name: 'Rôles & Affectations', icon: UserCheck },
  ];

  const [agents, setAgents] = useState([
    {
      id: 1,
      prenom: 'Martin',
      nom: 'Dubois',
      dateEntree: '2022-01-15',
      contrat: 'CDI',
      role: 'Responsable Commercial',
      datePaie: '2024-01-30',
      datePaiementEffectif: '2024-01-30',
      cv: null,
      statut: 'Chef de département',
      statutAgent: 'Actif',
      departement: 'Commerciale',
      congesRestants: 25,
      congesUtilises: 10,
      congesTotal: 35,
      absences: [
        { date: '2024-01-15', type: 'Maladie', justifie: true },
        { date: '2024-01-20', type: 'Retard', justifie: false, duree: '30 min' }
      ]
    },
    {
      id: 2,
      prenom: 'Sophie',
      nom: 'Bernard',
      dateEntree: '2021-03-10',
      contrat: 'CDI',
      role: 'Agent de Communication',
      datePaie: '2024-02-15',
      datePaiementEffectif: null,
      cv: null,
      statut: 'Agent simple',
      statutAgent: 'Actif',
      departement: 'Marketing',
      congesRestants: 18,
      congesUtilises: 17,
      congesTotal: 35,
      absences: []
    },
    {
      id: 3,
      prenom: 'Pierre',
      nom: 'Martin',
      dateEntree: '2023-06-01',
      contrat: 'CDD',
      role: 'Livreur',
      datePaie: '2024-02-10',
      datePaiementEffectif: '2024-02-10',
      cv: null,
      statut: 'Agent simple',
      statutAgent: 'Actif',
      departement: 'Logistique',
      congesRestants: 22,
      congesUtilises: 8,
      congesTotal: 30,
      absences: []
    }
  ]);

  const [showAgentForm, setShowAgentForm] = useState(false);
  const [showAbsenceForm, setShowAbsenceForm] = useState<number | null>(null);
  const [showCongesHistorique, setShowCongesHistorique] = useState<number | null>(null);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [selectedDepartement, setSelectedDepartement] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterContrat, setFilterContrat] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const [agentFormData, setAgentFormData] = useState({
    prenom: '',
    nom: '',
    dateEntree: '',
    contrat: 'CDI',
    role: '',
    datePaie: '',
    statut: 'Agent simple',
    departement: '',
    cv: null
  });

  const [absenceFormData, setAbsenceFormData] = useState({
    date: '',
    type: 'Absence',
    justifie: false,
    duree: '',
    motif: ''
  });

  const roles = [
    'Responsable Commercial',
    'Agent de Communication',
    'Livreur',
    'Agent de Vente',
    'Comptable',
    'Développeur',
    'Manager',
    'Technicien Support',
    'Chef de Projet'
  ];

  const departements = [
    { id: 'commerciale', name: 'Commerciale', icon: Users },
    { id: 'logistique', name: 'Logistique', icon: Building2 },
    { id: 'informatique', name: 'Informatique', icon: BarChart3 },
    { id: 'call-center', name: 'Call Center', icon: FileText },
    { id: 'marketing', name: 'Marketing', icon: Award }
  ];

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAgent) {
      setAgents(agents.map(agent => 
        agent.id === editingAgent.id 
          ? { ...agent, ...agentFormData }
          : agent
      ));
      setEditingAgent(null);
    } else {
      const newAgent = {
        id: agents.length + 1,
        ...agentFormData,
        statutAgent: 'Actif',
        congesRestants: 35,
        congesUtilises: 0,
        congesTotal: 35,
        absences: [],
        datePaiementEffectif: null
      };
      setAgents([...agents, newAgent]);
    }
    setAgentFormData({
      prenom: '',
      nom: '',
      dateEntree: '',
      contrat: 'CDI',
      role: '',
      datePaie: '',
      statut: 'Agent simple',
      departement: '',
      cv: null
    });
    setShowAgentForm(false);
  };

  const handleAbsenceSubmit = (e: React.FormEvent, agentId: number) => {
    e.preventDefault();
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            absences: [...agent.absences, { 
              ...absenceFormData,
              id: Date.now()
            }] 
          }
        : agent
    ));
    setAbsenceFormData({
      date: '',
      type: 'Absence',
      justifie: false,
      duree: '',
      motif: ''
    });
    setShowAbsenceForm(null);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === '' || 
      agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.departement.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesContrat = filterContrat === '' || agent.contrat === filterContrat;
    const matchesRole = filterRole === '' || agent.role === filterRole;
    
    return matchesSearch && matchesContrat && matchesRole;
  });

  const renderAgents = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Agents</h2>
          <p className="text-gray-600">Gérez les dossiers de vos agents</p>
        </div>
        <button 
          onClick={() => setShowAgentForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel agent</span>
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par nom, rôle, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterContrat}
          onChange={(e) => setFilterContrat(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous les contrats</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Stage">Stage</option>
          <option value="Freelance">Freelance</option>
        </select>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous les rôles</option>
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* Formulaire d'ajout d'agent */}
      {showAgentForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingAgent ? 'Modifier l\'agent' : 'Ajouter un nouvel agent'}
          </h3>
          <form onSubmit={handleAgentSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input
                type="text"
                value={agentFormData.prenom}
                onChange={(e) => setAgentFormData({...agentFormData, prenom: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                value={agentFormData.nom}
                onChange={(e) => setAgentFormData({...agentFormData, nom: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'entrée *</label>
              <input
                type="date"
                value={agentFormData.dateEntree}
                onChange={(e) => setAgentFormData({...agentFormData, dateEntree: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contrat *</label>
              <select
                value={agentFormData.contrat}
                onChange={(e) => setAgentFormData({...agentFormData, contrat: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Freelance">Freelance</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle *</label>
              <select
                value={agentFormData.role}
                onChange={(e) => setAgentFormData({...agentFormData, role: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un rôle</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
              <select
                value={agentFormData.statut}
                onChange={(e) => setAgentFormData({...agentFormData, statut: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Agent simple">Agent simple</option>
                <option value="Chef de département">Chef de département</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
              <select
                value={agentFormData.departement}
                onChange={(e) => setAgentFormData({...agentFormData, departement: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un département</option>
                <option value="Commerciale">Commerciale</option>
                <option value="Logistique">Logistique</option>
                <option value="Informatique">Informatique</option>
                <option value="Call Center">Call Center</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de paie</label>
              <input
                type="date"
                value={agentFormData.datePaie}
                onChange={(e) => setAgentFormData({...agentFormData, datePaie: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload du CV</label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingAgent ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAgentForm(false);
                  setEditingAgent(null);
                  setAgentFormData({
                    prenom: '',
                    nom: '',
                    dateEntree: '',
                    contrat: 'CDI',
                    role: '',
                    datePaie: '',
                    statut: 'Agent simple',
                    departement: '',
                    cv: null
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

      {/* Liste des agents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contrat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'entrée
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {agent.prenom[0]}{agent.nom[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{agent.prenom} {agent.nom}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      agent.statut === 'Chef de département' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {agent.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.departement}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {agent.contrat}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(agent.dateEntree).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setShowAbsenceForm(agent.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Fiche d'absence
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulaire d'absence */}
      {showAbsenceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiche d'absence</h3>
            <form onSubmit={(e) => handleAbsenceSubmit(e, showAbsenceForm)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={absenceFormData.date}
                  onChange={(e) => setAbsenceFormData({...absenceFormData, date: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={absenceFormData.type}
                  onChange={(e) => setAbsenceFormData({...absenceFormData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Absence">Absence</option>
                  <option value="Retard">Retard</option>
                  <option value="Maladie">Maladie</option>
                  <option value="Congé">Congé</option>
                </select>
              </div>
              {absenceFormData.type === 'Retard' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                  <input
                    type="text"
                    value={absenceFormData.duree}
                    onChange={(e) => setAbsenceFormData({...absenceFormData, duree: e.target.value})}
                    placeholder="ex: 30 min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif/Justification</label>
                <textarea
                  value={absenceFormData.motif}
                  onChange={(e) => setAbsenceFormData({...absenceFormData, motif: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={absenceFormData.justifie}
                  onChange={(e) => setAbsenceFormData({...absenceFormData, justifie: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Justifié</label>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowAbsenceForm(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderPaie = () => {
    const agentsPayes = agents.filter(a => a.datePaiementEffectif);
    const agentsNonPayes = agents.filter(a => !a.datePaiementEffectif);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion de la Paie</h2>
            <p className="text-gray-600">Gérez les paiements de vos agents</p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un agent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agents déjà payés */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Agents déjà payés ({agentsPayes.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date paiement</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {agentsPayes.filter(agent => 
                    searchTerm === '' || 
                    agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    agent.nom.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(agent => (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {agent.prenom} {agent.nom}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {agent.datePaiementEffectif ? new Date(agent.datePaiementEffectif).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 text-sm">
                          <Download className="w-4 h-4" />
                          <span>Délivrer reçu</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agents non encore payés */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <h3 className="text-lg font-semibold text-red-900 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Agents non encore payés ({agentsNonPayes.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date prévue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {agentsNonPayes.filter(agent => 
                    searchTerm === '' || 
                    agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    agent.nom.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(agent => (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {agent.prenom} {agent.nom}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {agent.datePaie ? new Date(agent.datePaie).toLocaleDateString('fr-FR') : 'Non définie'}
                      </td>
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

  const renderConges = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Congés</h2>
          <p className="text-gray-600">Suivez les congés de vos agents</p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un agent..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Liste des agents avec congés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.filter(agent => 
          searchTerm === '' || 
          agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.nom.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(agent => (
          <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {agent.prenom[0]}{agent.nom[0]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{agent.prenom} {agent.nom}</h3>
                <p className="text-sm text-gray-600">{agent.role}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Congés restants</span>
                <span className="text-lg font-bold text-green-600">{agent.congesRestants} jours</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Congés utilisés</span>
                <span className="text-sm font-medium text-gray-900">{agent.congesUtilises} jours</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total autorisé</span>
                <span className="text-sm font-medium text-gray-900">{agent.congesTotal} jours</span>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(agent.congesUtilises / agent.congesTotal) * 100}%` }}
                ></div>
              </div>
              
              <button 
                onClick={() => setShowCongesHistorique(agent.id)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Voir historique</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal historique des congés */}
      {showCongesHistorique && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {(() => {
              const agent = agents.find(a => a.id === showCongesHistorique);
              return (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Historique des congés - {agent?.prenom} {agent?.nom}
                    </h3>
                    <button
                      onClick={() => setShowCongesHistorique(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">{agent?.congesRestants}</p>
                      <p className="text-sm text-green-700">Jours restants</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{agent?.congesUtilises}</p>
                      <p className="text-sm text-blue-700">Jours utilisés</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-600">{agent?.congesTotal}</p>
                      <p className="text-sm text-gray-700">Total autorisé</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Calendrier des congés</h4>
                    <p className="text-gray-600 text-center py-8">
                      Calendrier interactif des congés à implémenter
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );

  const renderAssiduite = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Gestion de l'Assiduité</h2>
      
      {/* Barre de recherche */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher par nom, rôle..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Justifié</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agents.filter(agent => 
                searchTerm === '' || 
                agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.role.toLowerCase().includes(searchTerm.toLowerCase())
              ).flatMap(agent => 
                agent.absences.map((absence, index) => (
                  <tr key={`${agent.id}-${index}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {agent.prenom} {agent.nom}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{absence.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{absence.type}</td>
                    <td className="px-6 py-4">
                      {absence.justifie ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion de la Performance</h2>
        <p className="text-gray-600">Suivez les performances de vos agents</p>
      </div>

      {/* Barre de recherche */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un agent ou filtrer par rôle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.filter(agent => 
          searchTerm === '' || 
          agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.role.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(agent => (
          <div key={agent.id} className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">{agent.prenom} {agent.nom}</h3>
            <p className="text-sm text-gray-600 mb-4">{agent.role}</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Temps moyen/tâche</span>
                <span className="text-sm font-medium">2h 30min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Score performance</span>
                <span className="text-sm font-medium text-green-600">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tâches complétées</span>
                <span className="text-sm font-medium">127</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRolesAffectations = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Rôles & Affectations</h2>
        <p className="text-gray-600">Organisation par départements</p>
      </div>

      {selectedDepartement ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedDepartement(null)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <ChevronRight className="w-4 h-4 transform rotate-180" />
            <span>Retour aux départements</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Département {selectedDepartement}
            </h3>

            {/* Chefs de département */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Chefs de département</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.filter(agent => 
                  agent.departement === selectedDepartement && 
                  agent.statut === 'Chef de département'
                ).map(agent => (
                  <div key={agent.id} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-700">
                          {agent.prenom[0]}{agent.nom[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{agent.prenom} {agent.nom}</p>
                        <p className="text-sm text-gray-600">{agent.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agents */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Agents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.filter(agent => 
                  agent.departement === selectedDepartement && 
                  agent.statut === 'Agent simple'
                ).map(agent => (
                  <div key={agent.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-700">
                          {agent.prenom[0]}{agent.nom[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{agent.prenom} {agent.nom}</p>
                        <p className="text-sm text-gray-600">{agent.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departements.map((dept) => {
            const Icon = dept.icon;
            const agentsCount = agents.filter(agent => 
              agent.departement.toLowerCase() === dept.name.toLowerCase()
            ).length;
            const chefsCount = agents.filter(agent => 
              agent.departement.toLowerCase() === dept.name.toLowerCase() && 
              agent.statut === 'Chef de département'
            ).length;

            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartement(dept.name)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total agents</span>
                    <span className="text-sm font-medium">{agentsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Chefs</span>
                    <span className="text-sm font-medium">{chefsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Agents simples</span>
                    <span className="text-sm font-medium">{agentsCount - chefsCount}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-blue-600">
                  <span className="text-sm">Voir détails</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'agents':
        return renderAgents();
      case 'paie':
        return renderPaie();
      case 'assiduite':
        return renderAssiduite();
      case 'conges':
        return renderConges();
      case 'performance':
        return renderPerformance();
      case 'roles':
        return renderRolesAffectations();
      default:
        return renderAgents();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion RH</h1>
        <p className="text-gray-600">Gérez vos agents, paie et performances</p>
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

export default GestionRH;