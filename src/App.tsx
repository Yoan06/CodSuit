import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import Approvisionnement from './components/Modules/Approvisionnement';
import GestionEntreprise from './components/Modules/GestionEntreprise';
import GestionRH from './components/Modules/GestionRH';
import Financier from './components/Modules/Financier';
import GestionLivraison from './components/Modules/GestionLivraison';
import RelationClient from './components/Modules/RelationClient';
import ModuleWrapper from './components/Modules/ModuleWrapper';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'approvisionnement':
        return <Approvisionnement />;
      case 'gestion-entreprise':
        return <GestionEntreprise />;
      case 'gestion-rh':
        return <GestionRH />;
      case 'financier':
        return <Financier />;
      case 'gestion-livraison':
        return <GestionLivraison />;
      case 'relation-client':
        return <RelationClient />;
      case 'marketing':
        return (
          <ModuleWrapper 
            title="Marketing & Publicité" 
            description="Gérez vos campagnes et créatifs publicitaires"
          />
        );
      case 'commandes':
        return (
          <ModuleWrapper 
            title="Gestion des Commandes" 
            description="Gérez vos commandes et affectations"
          />
        );
      case 'stock':
        return (
          <ModuleWrapper 
            title="Gestion de Stocks" 
            description="Suivez vos stocks en temps réel"
          />
        );
      case 'boutiques':
        return (
          <ModuleWrapper 
            title="Gestion des Boutiques" 
            description="Gérez vos points de vente"
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <Navbar />
      <div className="ml-64 pt-16">
        {renderModule()}
      </div>
    </div>
  );
}

export default App;