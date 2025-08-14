import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <Navbar />
        <div className="ml-64 pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/approvisionnement" element={<Approvisionnement />} />
            <Route path="/gestion-entreprise" element={<GestionEntreprise />} />
            <Route path="/gestion-rh" element={<GestionRH />} />
            <Route path="/financier" element={<Financier />} />
            <Route path="/gestion-livraison" element={<GestionLivraison />} />
            <Route path="/relation-client" element={<RelationClient />} />
            <Route path="/marketing" element={<ModuleWrapper title="Marketing & Publicité" description="Gérez vos campagnes et créatifs publicitaires" />} />
            <Route path="/commandes" element={<ModuleWrapper title="Gestion des Commandes" description="Gérez vos commandes et affectations" />} />
            <Route path="/stock" element={<ModuleWrapper title="Gestion de Stocks" description="Suivez vos stocks en temps réel" />} />
            <Route path="/boutiques" element={<ModuleWrapper title="Gestion des Boutiques" description="Gérez vos points de vente" />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;