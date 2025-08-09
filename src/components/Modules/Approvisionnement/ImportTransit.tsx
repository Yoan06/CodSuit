import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Truck, Clock, Package, Globe } from 'lucide-react';
import { getImportTransits } from '../../../services/importTransitService';

interface EtapeTransit {
  id: number;
  lieu: string;
  date: string;
  statut: string;
  description: string;
}

interface ImportTransitType {
  id: number;
  numero_commande: string;
  produit: number;
  quantite: number;
  fournisseur: number;
  pays_origine: string;
  region_actuelle: string;
  lieu_actuel: string;
  statut: 'en_transit' | 'douane' | 'livre' | 'bloque';
  date_expedition: string;
  date_livraison_prevue: string;
  transporteur: string;
  numero_suivi: string;
  etapes: EtapeTransit[];
}

const ImportTransit: React.FC = () => {
  const [importTransits, setImportTransits] = useState<ImportTransitType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

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
  const fetchImportTransits = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getImportTransits(token);
      setImportTransits(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des imports/transits:", err);
      setError("Erreur lors du chargement des imports/transits.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchImportTransits();
  }, [token, fetchImportTransits]);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_transit': return 'bg-blue-100 text-blue-800';
      case 'douane': return 'bg-yellow-100 text-yellow-800';
      case 'livre': return 'bg-green-100 text-green-800';
      case 'bloque': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'en_transit': return 'En transit';
      case 'douane': return 'Douane';
      case 'livre': return 'Livré';
      case 'bloque': return 'Bloqué';
      default: return statut;
    }
  };

  if (loading) return <div className="text-center text-gray-600">Chargement...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  const commandesEnTransit = importTransits.filter(c => c.statut === 'en_transit');
  const commandesDouane = importTransits.filter(c => c.statut === 'douane');
  const commandesLivrees = importTransits.filter(c => c.statut === 'livre');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Import & Transit</h2>
          <p className="text-gray-600">Suivez vos commandes internationales en temps réel</p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <Truck className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{commandesEnTransit.length}</p>
              <p className="text-sm text-blue-700">En transit</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">{commandesDouane.length}</p>
              <p className="text-sm text-yellow-700">En douane</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">{commandesLivrees.length}</p>
              <p className="text-sm text-green-700">Livrées</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-900">{importTransits.length}</p>
              <p className="text-sm text-purple-700">Total commandes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commandes en transit */}
      <div className="space-y-6">
        {importTransits.map((commande) => (
          <div key={commande.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Informations principales */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{commande.numero_commande}</h3>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(commande.statut)}`}>
                    <span>{getStatutLabel(commande.statut)}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Produit</p>
                    <p className="font-medium text-gray-900">{commande.produit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantité</p>
                    <p className="font-medium text-gray-900">{commande.quantite} unités</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fournisseur</p>
                    <p className="font-medium text-gray-900">{commande.fournisseur}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pays d'origine</p>
                    <p className="font-medium text-gray-900">{commande.pays_origine}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Région actuelle</p>
                    <p className="font-medium text-gray-900">{commande.region_actuelle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lieu actuel</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-red-500" />
                      {commande.lieu_actuel}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Transporteur</p>
                    <p className="font-medium text-gray-900">{commande.transporteur}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Numéro de suivi</p>
                    <p className="font-medium text-gray-900 font-mono">{commande.numero_suivi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date d'expédition</p>
                    <p className="font-medium text-gray-900">
                      {new Date(commande.date_expedition).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Livraison prévue</p>
                    <p className="font-medium text-gray-900">
                      {new Date(commande.date_livraison_prevue).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Suivi des étapes */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Suivi du transport</h4>
              <div className="space-y-4">
                {commande.etapes.map((etape, index) => (
                  <div key={etape.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      index === commande.etapes.length - 1 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-green-600 text-white'
                    }`}>
                      {index === commande.etapes.length - 1 ? (
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
                        {new Date(etape.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImportTransit;