import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Truck, 
  Clock, 
  Package, 
  Globe, 
  Edit, 
  Search, 
  Eye,
  Plus,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { getImportTransits } from '../../../services/importTransitService';
import { getLivraisons, updateLivraison } from '../../../services/livraisonService';
import { 
  getHistoriqueLieux, 
  createHistoriqueLieu, 
  updateHistoriqueLieu, 
  deleteHistoriqueLieu 
} from '../../../services/historiqueLieuService';

interface EtapeTransit {
  id: number;
  nom: string;
  lieu: string;
  date_prevue: string;
  date_reelle?: string;
  statut: 'en_attente' | 'en_cours' | 'terminee' | 'retardee';
  description: string;
  duree_estimee?: string;
  responsable?: string;
  notes?: string;
  ordre: number;
}

interface ImportTransitType {
  id: number;
  numero_commande: string;
  produit: number;
  produit_nom: string;
  quantite: number;
  fournisseur: number;
  fournisseur_nom: string;
  pays_origine: string;
  region_actuelle: string;
  lieu_actuel: string;
  statut: 'en_preparation' | 'en_transit' | 'douane' | 'arrive' | 'en_stock' | 'livre' | 'bloque';
  date_expedition: string;
  date_livraison_prevue: string;
  date_arrivee_reelle?: string;
  transporteur: string;
  numero_suivi: string;
  valeur_totale: number;
  poids_total: number;
  nombre_conteneurs: number;
  port_depart?: string;
  port_arrivee?: string;
  notes?: string;
  etapes: EtapeTransit[];
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

interface HistoriqueLieu {
  id: number;
  import_transit: number;
  lieu: string;
  date_passage: string;
  description?: string;
  statut: 'en_cours' | 'termine' | 'retarde';
  notes?: string;
  ordre: number;
  date_creation: string;
}

const ImportTransit: React.FC = () => {
  const { token } = useAuth();
  const [importTransits, setImportTransits] = useState<ImportTransitType[]>([]);
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [historiqueLieux, setHistoriqueLieux] = useState<HistoriqueLieu[]>([]);
  const [selectedImport, setSelectedImport] = useState<ImportTransitType | null>(null);
  const [selectedLivraison, setSelectedLivraison] = useState<Livraison | null>(null);
  const [showLivraisonForm, setShowLivraisonForm] = useState(false);
  const [showHistoriqueForm, setShowHistoriqueForm] = useState(false);
  const [editingHistorique, setEditingHistorique] = useState<HistoriqueLieu | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('tous');
  const [filterNiveau, setFilterNiveau] = useState<string>('tous');
  const [viewMode, setViewMode] = useState<'imports' | 'livraisons' | 'toutes' | 'historique'>('toutes');
  const [loading, setLoading] = useState(false);

  // Récupération des données
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    
    try {
      // Essayer de récupérer les vraies données
      const [resImports, resLivraisons, resHistorique] = await Promise.all([
        getImportTransits(token),
        getLivraisons(token),
        getHistoriqueLieux(token)
      ]);
      
      const importsData = Array.isArray(resImports.data) ? resImports.data : (resImports.data?.results ?? []);
      const livraisonsData = Array.isArray(resLivraisons.data) ? resLivraisons.data : (resLivraisons.data?.results ?? []);
      const histData = Array.isArray(resHistorique.data) ? resHistorique.data : (resHistorique.data?.results ?? []);

      setImportTransits(importsData);
      setLivraisons(livraisonsData);
      setHistoriqueLieux(histData);
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      
      // En cas d'erreur, afficher un message d'erreur
      console.log("Erreur de connexion à l'API");
      setImportTransits([]);
      setLivraisons([]);
      setHistoriqueLieux([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token, fetchData]);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_preparation': return 'bg-yellow-100 text-yellow-800';
      case 'en_transit': return 'bg-blue-100 text-blue-800';
      case 'douane': return 'bg-orange-100 text-orange-800';
      case 'arrive': return 'bg-green-100 text-green-800';
      case 'en_stock': return 'bg-purple-100 text-purple-800';
      case 'livre': return 'bg-green-100 text-green-800';
      case 'bloque': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case 'en_transit': return 'bg-blue-100 text-blue-800';
      case 'en_douane': return 'bg-orange-100 text-orange-800';
      case 'livree': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'en_preparation': return 'En préparation';
      case 'en_transit': return 'En transit';
      case 'douane': return 'Douane';
      case 'arrive': return 'Arrivé';
      case 'en_stock': return 'En stock';
      case 'livre': return 'Livré';
      case 'bloque': return 'Bloqué';
      default: return statut;
    }
  };

  const getNiveauLabel = (niveau: string) => {
    switch (niveau) {
      case 'en_transit': return 'En transit';
      case 'en_douane': return 'En douane';
      case 'livree': return 'Livrée';
      default: return niveau;
    }
  };

  // Filtrer les livraisons selon le niveau
  const livraisonsEnTransit = livraisons.filter(l => l.niveau === 'en_transit');
  const livraisonsEnDouane = livraisons.filter(l => l.niveau === 'en_douane');
  const livraisonsLivrees = livraisons.filter(l => l.niveau === 'livree');

  const filteredLivraisons = livraisons.filter(livraison => {
    const matchesSearch =
      livraison.numero_commande.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatut = filterStatut === 'tous' || livraison.statut === filterStatut;
    const matchesNiveau = filterNiveau === 'tous' || livraison.niveau === filterNiveau;

    return matchesSearch && matchesStatut && matchesNiveau;
  });

  const handleLivraisonEdit = (livraison: Livraison) => {
    setSelectedLivraison(livraison);
    setShowLivraisonForm(true);
  };

  const handleLivraisonUpdate = async (livraisonId: number, updates: {
    statut: 'a_livrer' | 'en_cours' | 'livree';
    niveau: 'en_transit' | 'en_douane' | 'livree';
    livreur?: string;
    bon_livraison_numero?: string;
  }) => {
    if (!token) return;

    try {
      // Créer un payload compatible avec le service
      const payload = {
        numero_commande: selectedLivraison?.numero_commande || '',
        produit: selectedLivraison?.produit || 0,
        quantite: selectedLivraison?.quantite || 0,
        date_livraison: selectedLivraison?.date_livraison || '',
        statut: updates.statut,
        bon_livraison_numero: updates.bon_livraison_numero,
        livreur: updates.livreur
      };

      await updateLivraison(livraisonId, payload, token);

      // Mettre à jour l'état local
      setLivraisons(prevLivraisons =>
        prevLivraisons.map(liv =>
          liv.id === livraisonId ? { ...liv, ...updates } : liv
        )
      );

      setSelectedLivraison(null);
      setShowLivraisonForm(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la livraison:", err);
    }
  };

  // Gestion de l'historique des lieux
  const handleHistoriqueCreate = async (data: {
    lieu: string;
    date_passage: string;
    description: string;
    statut: 'en_cours' | 'termine' | 'retarde';
    notes: string; 
  }) => {
    if (!token || !selectedImport) return;
    
    try {
      const newData = {
        ...data,
        import_transit: selectedImport.id,
        ordre: historiqueLieux.filter(h => h.import_transit === selectedImport.id).length + 1
      };
      
      await createHistoriqueLieu(token, newData);
      fetchData(); // Recharger les données
      setShowHistoriqueForm(false);
    } catch (err) {
      console.error("Erreur lors de la création du lieu:", err);
    }
  };

  const handleHistoriqueUpdate = async (id: number, data: {
    lieu: string;
    date_passage: string;
    description: string;
    statut: 'en_cours' | 'termine' | 'retarde';
    notes: string;
  }) => {
    if (!token) return;
    
    try {
      await updateHistoriqueLieu(token, id, data);
      fetchData(); // Recharger les données
      setEditingHistorique(null);
      setShowHistoriqueForm(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du lieu:", err);
    }
  };

  const handleHistoriqueDelete = async (id: number) => {
    if (!token) return;
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce lieu de l'historique ?")) {
      try {
        await deleteHistoriqueLieu(token, id);
        fetchData(); // Recharger les données
      } catch (err) {
        console.error("Erreur lors de la suppression du lieu:", err);
      }
    }
  };

  // Ajout de logs de débogage
  console.log("ImportTransit - État actuel:", {
    viewMode,
    historiqueLieux: historiqueLieux.length,
    selectedImport: selectedImport?.id,
    loading
  });

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-600">Veuillez vous connecter pour voir Import/Transit.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-600">Chargement des données...</div>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Import & Transit</h2>
          <p className="text-gray-600">Suivez vos commandes internationales et la traçabilité complète des produits</p>
        </div>
      </div>



      {/* Sélecteur de vue */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setViewMode('toutes')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'toutes'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Toutes les Commandes
        </button>
        <button
          onClick={() => setViewMode('imports')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'imports'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Imports & Transit
        </button>
        <button
          onClick={() => setViewMode('livraisons')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'livraisons'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Livraisons
        </button>
        <button
          onClick={() => setViewMode('historique')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'historique'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Historique des Lieux
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <Truck className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{livraisonsEnTransit.length}</p>
              <p className="text-sm text-blue-700">En transit</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-orange-900">{livraisonsEnDouane.length}</p>
              <p className="text-sm text-orange-700">En douane</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">{livraisonsLivrees.length}</p>
              <p className="text-sm text-green-700">Livrées</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-900">{livraisons.length}</p>
              <p className="text-sm text-purple-700">Total commandes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par référence de commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="tous">Tous les statuts</option>
          <option value="a_livrer">À livrer</option>
          <option value="en_cours">En cours</option>
          <option value="livree">Livrée</option>
        </select>

        <select
          value={filterNiveau}
          onChange={(e) => setFilterNiveau(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="tous">Tous les niveaux</option>
          <option value="en_transit">En transit</option>
          <option value="en_douane">En douane</option>
          <option value="livree">Livrée</option>
        </select>
      </div>

      {/* Contenu selon la vue sélectionnée */}
      {viewMode === 'toutes' && (
        <>
          {/* Toutes les commandes (livraisons) */}
          <div className="space-y-6">
            {filteredLivraisons.map((livraison) => (
              <div key={livraison.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Informations principales */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{livraison.numero_commande}</h3>
                      <div className="flex space-x-2">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(livraison.statut)}`}>
                          <span>{getStatutLabel(livraison.statut)}</span>
                        </span>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getNiveauColor(livraison.niveau)}`}>
                          <span>{getNiveauLabel(livraison.niveau)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Produit</p>
                        <p className="font-medium text-gray-900">{livraison.produit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Quantité</p>
                        <p className="font-medium text-gray-900">{livraison.quantite} unités</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date de livraison</p>
                        <p className="font-medium text-gray-900">
                          {new Date(livraison.date_livraison).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Livreur</p>
                        <p className="font-medium text-gray-900">{livraison.livreur || 'Non assigné'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bon de livraison</p>
                        <p className="font-medium text-gray-900">{livraison.bon_livraison_numero || 'Non défini'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bouton pour modifier */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleLivraisonEdit(livraison)}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === 'imports' && (
        <>
          {/* Liste des imports */}
          <div className="space-y-6">
            {importTransits.map((import_) => (
              <div key={import_.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Informations principales */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{import_.numero_commande}</h3>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(import_.statut)}`}>
                        <span>{getStatutLabel(import_.statut)}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Produit</p>
                        <p className="font-medium text-gray-900">{import_.produit_nom}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Quantité</p>
                        <p className="font-medium text-gray-900">{import_.quantite} unités</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fournisseur</p>
                        <p className="font-medium text-gray-900">{import_.fournisseur_nom}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pays d'origine</p>
                        <p className="font-medium text-gray-900">{import_.pays_origine}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Région actuelle</p>
                        <p className="font-medium text-gray-900">{import_.region_actuelle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lieu actuel</p>
                        <p className="font-medium text-gray-900 flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-red-500" />
                          {import_.lieu_actuel}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Transporteur</p>
                        <p className="font-medium text-gray-900">{import_.transporteur}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Numéro de suivi</p>
                        <p className="font-medium text-gray-900 font-mono">{import_.numero_suivi}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date d'expédition</p>
                        <p className="font-medium text-gray-900">
                          {new Date(import_.date_expedition).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Livraison prévue</p>
                        <p className="font-medium text-gray-900">
                          {new Date(import_.date_livraison_prevue).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suivi des étapes */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Suivi du transport</h4>
                  <div className="space-y-4">
                    {import_.etapes.map((etape, index) => (
                      <div key={etape.id} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          index === import_.etapes.length - 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-green-600 text-white'
                        }`}>
                          {index === import_.etapes.length - 1 ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <Package className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-gray-900">{etape.lieu}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800`}>
                              {etape.statut}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{etape.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(etape.date_prevue).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bouton pour voir les détails */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedImport(import_)}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Voir les détails</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === 'livraisons' && (
        <>
          {/* Vue des livraisons */}
          <div className="space-y-6">
            {filteredLivraisons.map(livraison => (
              <div key={livraison.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Informations principales */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{livraison.numero_commande}</h3>
                      <div className="flex space-x-2">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(livraison.statut)}`}>
                          <span>{getStatutLabel(livraison.statut)}</span>
                        </span>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getNiveauColor(livraison.niveau)}`}>
                          <span>{getNiveauLabel(livraison.niveau)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Produit</p>
                        <p className="font-medium text-gray-900">{livraison.produit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Quantité</p>
                        <p className="font-medium text-gray-900">{livraison.quantite} unités</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date de livraison</p>
                        <p className="font-medium text-gray-900">
                          {new Date(livraison.date_livraison).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Livreur</p>
                        <p className="font-medium text-gray-900">{livraison.livreur || 'Non assigné'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bon de livraison</p>
                        <p className="font-medium text-gray-900">{livraison.bon_livraison_numero || 'Non défini'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bouton pour modifier */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleLivraisonEdit(livraison)}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === 'historique' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Historique des lieux de passage des produits</h3>
            <button
              onClick={() => setShowHistoriqueForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un lieu</span>
            </button>
          </div>
          
          {/* Debug info */}
          <div className="bg-gray-100 p-4 rounded-lg text-sm">
            <p>Debug: VueMode = {viewMode}</p>
            <p>HistoriqueLieux count: {historiqueLieux.length}</p>
            <p>ImportTransits count: {importTransits.length}</p>
            <p>SelectedImport: {selectedImport ? selectedImport.numero_commande : 'Aucun'}</p>
          </div>

          {/* Vérification de sécurité */}
          {historiqueLieux.length === 0 && importTransits.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <h4 className="text-lg font-medium text-yellow-800 mb-2">Aucune donnée disponible</h4>
              <p className="text-yellow-700">
                Il n'y a actuellement aucun import/transit ou historique de lieux enregistré.
                <br />
                Commencez par créer des imports dans l'onglet "Imports & Transit".
              </p>
            </div>
          ) : (
            <>
              {/* Sélection de l'import pour filtrer l'historique */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrer par import/transit
                </label>
                <select
                  onChange={(e) => {
                    const importId = parseInt(e.target.value);
                    if (importId) {
                      setSelectedImport(importTransits.find(imp => imp.id === importId) || null);
                    } else {
                      setSelectedImport(null);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les imports</option>
                  {importTransits.map(imp => (
                    <option key={imp.id} value={imp.id}>
                      {imp.numero_commande} - {imp.produit_nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Liste de l'historique des lieux */}
              <div className="space-y-4">
                {(Array.isArray(historiqueLieux) ? historiqueLieux : [])
                  .filter(h => !selectedImport || h.import_transit === selectedImport.id)
                  .sort((a, b) => a.ordre - b.ordre)
                  .map((lieu) => (
                    <div key={lieu.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <h4 className="text-lg font-medium text-gray-900">{lieu.lieu}</h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              lieu.statut === 'termine' ? 'bg-green-100 text-green-800' :
                              lieu.statut === 'retarde' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {lieu.statut === 'termine' ? 'Terminé' :
                               lieu.statut === 'retarde' ? 'Retardé' :
                               'En cours'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Date de passage</p>
                              <p className="font-medium text-gray-900">
                                {new Date(lieu.date_passage).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Ordre</p>
                              <p className="font-medium text-gray-900">{lieu.ordre}</p>
                            </div>
                            {lieu.description && (
                              <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="text-gray-900">{lieu.description}</p>
                              </div>
                            )}
                            {lieu.notes && (
                              <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Notes</p>
                                <p className="text-gray-900">{lieu.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingHistorique(lieu);
                              setShowHistoriqueForm(true);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleHistoriqueDelete(lieu.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {(Array.isArray(historiqueLieux) ? historiqueLieux : []).filter(h => !selectedImport || h.import_transit === selectedImport.id).length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    {selectedImport 
                      ? `Aucun lieu enregistré pour l'import ${selectedImport.numero_commande}`
                      : "Aucun lieu enregistré dans l'historique"
                    }
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Détails de l'import sélectionné */}
      {selectedImport && (
        <div className="mb-6">
          <button
            onClick={() => setSelectedImport(null)}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center space-x-2"
          >
            <span>← Retour à la liste</span>
          </button>
          {/* Ici on peut ajouter le rendu des détails de l'import */}
        </div>
      )}

      {/* Formulaire de modification de livraison */}
      {showLivraisonForm && selectedLivraison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier la livraison</h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updates = {
                statut: formData.get('statut') as 'a_livrer' | 'en_cours' | 'livree',
                niveau: formData.get('niveau') as 'en_transit' | 'en_douane' | 'livree',
                livreur: formData.get('livreur') as string,
                bon_livraison_numero: formData.get('bon_livraison_numero') as string,
              };
              handleLivraisonUpdate(selectedLivraison.id, updates);
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      name="statut"
                      defaultValue={selectedLivraison.statut}
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
                      defaultValue={selectedLivraison.niveau}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en_transit">En transit</option>
                      <option value="en_douane">En douane</option>
                      <option value="livree">Livrée</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Livreur</label>
                  <input
                    type="text"
                    name="livreur"
                    defaultValue={selectedLivraison.livreur || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom du livreur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bon de livraison</label>
                  <input
                    type="text"
                    name="bon_livraison_numero"
                    defaultValue={selectedLivraison.bon_livraison_numero || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Numéro du bon de livraison"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mettre à jour
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLivraison(null);
                    setShowLivraisonForm(false);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire pour ajouter/modifier un lieu dans l'historique */}
      {showHistoriqueForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingHistorique ? 'Modifier le lieu' : 'Ajouter un nouveau lieu'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                lieu: formData.get('lieu') as string,
                date_passage: formData.get('date_passage') as string,
                description: formData.get('description') as string,
                statut: formData.get('statut') as 'en_cours' | 'termine' | 'retarde',
                notes: formData.get('notes') as string,
              };
              
              if (editingHistorique) {
                handleHistoriqueUpdate(editingHistorique.id, data);
              } else {
                handleHistoriqueCreate(data);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu *</label>
                  <input
                    type="text"
                    name="lieu"
                    defaultValue={editingHistorique?.lieu || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom du lieu (ex: Port de Shanghai, Douane de Marseille...)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de passage *</label>
                  <input
                    type="date"
                    name="date_passage"
                    defaultValue={editingHistorique?.date_passage || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    name="statut"
                    defaultValue={editingHistorique?.statut || 'en_cours'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                    <option value="retarde">Retardé</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingHistorique?.description || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description du passage par ce lieu..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    defaultValue={editingHistorique?.notes || ''}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Notes additionnelles..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingHistorique ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowHistoriqueForm(false);
                    setEditingHistorique(null);
                  }}
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
};

export default ImportTransit;