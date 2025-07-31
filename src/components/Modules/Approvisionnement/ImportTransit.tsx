import React, { useState } from 'react';
import { MapPin, Truck, Clock, Package, Globe, Navigation } from 'lucide-react';

interface CommandeTransit {
  id: number;
  numeroCommande: string;
  produit: string;
  quantite: number;
  fournisseur: string;
  paysOrigine: string;
  regionActuelle: string;
  lieuActuel: string;
  statut: 'En transit' | 'Douane' | 'Livré' | 'Bloqué';
  dateExpedition: string;
  dateLivraisonPrevue: string;
  transporteur: string;
  numeroSuivi: string;
  etapes: {
    lieu: string;
    date: string;
    statut: string;
    description: string;
  }[];
}

const ImportTransit: React.FC = () => {
  const [commandesTransit] = useState<CommandeTransit[]>([
    {
      id: 1,
      numeroCommande: 'IMP-2024-001',
      produit: 'Smartphones XYZ Pro (Lot)',
      quantite: 500,
      fournisseur: 'TechnoSupply SARL',
      paysOrigine: 'Chine',
      regionActuelle: 'Europe',
      lieuActuel: 'Port de Rotterdam, Pays-Bas',
      statut: 'En transit',
      dateExpedition: '2024-01-20',
      dateLivraisonPrevue: '2024-02-15',
      transporteur: 'Global Shipping Express',
      numeroSuivi: 'GSE-2024-789456',
      etapes: [
        {
          lieu: 'Shenzhen, Chine',
          date: '2024-01-20',
          statut: 'Expédié',
          description: 'Marchandise expédiée depuis l\'usine'
        },
        {
          lieu: 'Port de Shanghai, Chine',
          date: '2024-01-22',
          statut: 'En transit',
          description: 'Chargement sur navire cargo'
        },
        {
          lieu: 'Canal de Suez, Égypte',
          date: '2024-02-05',
          statut: 'En transit',
          description: 'Passage du canal de Suez'
        },
        {
          lieu: 'Port de Rotterdam, Pays-Bas',
          date: '2024-02-12',
          statut: 'Arrivé',
          description: 'Arrivée au port européen'
        }
      ]
    },
    {
      id: 2,
      numeroCommande: 'IMP-2024-002',
      produit: 'Composants électroniques',
      quantite: 1000,
      fournisseur: 'ElectroComponents Ltd',
      paysOrigine: 'Corée du Sud',
      regionActuelle: 'Asie',
      lieuActuel: 'Busan, Corée du Sud',
      statut: 'Douane',
      dateExpedition: '2024-02-01',
      dateLivraisonPrevue: '2024-02-25',
      transporteur: 'Asia Pacific Logistics',
      numeroSuivi: 'APL-2024-123789',
      etapes: [
        {
          lieu: 'Séoul, Corée du Sud',
          date: '2024-02-01',
          statut: 'Expédié',
          description: 'Marchandise expédiée depuis l\'entrepôt'
        },
        {
          lieu: 'Busan, Corée du Sud',
          date: '2024-02-03',
          statut: 'Douane',
          description: 'Contrôle douanier en cours'
        }
      ]
    },
    {
      id: 3,
      numeroCommande: 'IMP-2024-003',
      produit: 'Accessoires informatiques',
      quantite: 200,
      fournisseur: 'TechAccessories Inc',
      paysOrigine: 'Taïwan',
      regionActuelle: 'Europe',
      lieuActuel: 'Entrepôt Paris, France',
      statut: 'Livré',
      dateExpedition: '2024-01-10',
      dateLivraisonPrevue: '2024-02-05',
      transporteur: 'EuroTrans Logistics',
      numeroSuivi: 'ETL-2024-456123',
      etapes: [
        {
          lieu: 'Taipei, Taïwan',
          date: '2024-01-10',
          statut: 'Expédié',
          description: 'Marchandise expédiée'
        },
        {
          lieu: 'Port de Kaohsiung, Taïwan',
          date: '2024-01-12',
          statut: 'En transit',
          description: 'Chargement maritime'
        },
        {
          lieu: 'Port du Havre, France',
          date: '2024-02-02',
          statut: 'Arrivé',
          description: 'Arrivée en France'
        },
        {
          lieu: 'Entrepôt Paris, France',
          date: '2024-02-05',
          statut: 'Livré',
          description: 'Livraison effectuée'
        }
      ]
    }
  ]);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'En transit':
        return 'bg-blue-100 text-blue-800';
      case 'Douane':
        return 'bg-yellow-100 text-yellow-800';
      case 'Livré':
        return 'bg-green-100 text-green-800';
      case 'Bloqué':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'En transit':
        return <Truck className="w-4 h-4" />;
      case 'Douane':
        return <Clock className="w-4 h-4" />;
      case 'Livré':
        return <Package className="w-4 h-4" />;
      case 'Bloqué':
        return <Navigation className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const commandesEnTransit = commandesTransit.filter(c => c.statut === 'En transit');
  const commandesDouane = commandesTransit.filter(c => c.statut === 'Douane');
  const commandesLivrees = commandesTransit.filter(c => c.statut === 'Livré');

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
              <p className="text-2xl font-bold text-purple-900">{commandesTransit.length}</p>
              <p className="text-sm text-purple-700">Total commandes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commandes en transit */}
      <div className="space-y-6">
        {commandesTransit.map((commande) => (
          <div key={commande.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Informations principales */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{commande.numeroCommande}</h3>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(commande.statut)}`}>
                    {getStatutIcon(commande.statut)}
                    <span>{commande.statut}</span>
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
                    <p className="font-medium text-gray-900">{commande.paysOrigine}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Région actuelle</p>
                    <p className="font-medium text-gray-900">{commande.regionActuelle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lieu actuel</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-red-500" />
                      {commande.lieuActuel}
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
                    <p className="font-medium text-gray-900 font-mono">{commande.numeroSuivi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date d'expédition</p>
                    <p className="font-medium text-gray-900">
                      {new Date(commande.dateExpedition).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Livraison prévue</p>
                    <p className="font-medium text-gray-900">
                      {new Date(commande.dateLivraisonPrevue).toLocaleDateString('fr-FR')}
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
                  <div key={index} className="flex items-start space-x-4">
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
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          etape.statut === 'Livré' ? 'bg-green-100 text-green-800' :
                          etape.statut === 'Expédié' ? 'bg-blue-100 text-blue-800' :
                          etape.statut === 'Arrivé' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
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