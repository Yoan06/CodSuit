import React, { useState } from 'react';
import { 
  Package, 
  Users, 
  Calendar, 
  FileText, 
  Truck, 
  ShoppingCart,
  MapPin,
  Building,
  Bug
} from 'lucide-react';
import GestionFournisseurs from './Approvisionnement/GestionFournisseurs';
import Produits from './Approvisionnement/Produits';
import BonsCommande from './Approvisionnement/BonsCommande';
import Livraisons from './Approvisionnement/Livraisons';
import Echeances from './Approvisionnement/Echeances';
import ImportTransit from './Approvisionnement/ImportTransit';
import CommandesAchats from './Approvisionnement/CommandesAchats';
import TestAPI from './Approvisionnement/TestAPI';
import Saisons from './Approvisionnement/Saisons';

const Approvisionnement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('test');

  const tabs = [
    { id: 'test', name: 'Test API', icon: Bug },
    { id: 'fournisseurs', name: 'Gestion des Fournisseurs', icon: Users },
    { id: 'echeances', name: 'Échéances', icon: Calendar },
    { id: 'produits', name: 'Produits', icon: Package },
    { id: 'commandes', name: 'Bons de Commande', icon: FileText },
    { id: 'livraisons', name: 'Livraisons', icon: Truck },
    { id: 'commandes-achats', name: 'Commandes d\'Achats', icon: ShoppingCart },
    { id: 'import', name: 'Import/Transit', icon: MapPin },
    { id: 'saisons', name: 'Saisons', icon: Building },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'test':
        return <TestAPI />;
      case 'fournisseurs':
        return <GestionFournisseurs />;
      case 'echeances':
        return <Echeances />;
      case 'produits':
        return <Produits />;
      case 'commandes':
        return <BonsCommande />;
      case 'livraisons':
        return <Livraisons />;
      case 'commandes-achats':
        return <CommandesAchats />;
      case 'import':
        return <ImportTransit />;
      case 'saisons':
        return <Saisons />;
      default:
        return <TestAPI />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion de l'Approvisionnement</h1>
        <p className="text-gray-600">Gérez vos fournisseurs, commandes et approvisionnements</p>
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

export default Approvisionnement;