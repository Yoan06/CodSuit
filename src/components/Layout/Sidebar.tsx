import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  Users, 
  Calculator, 
  Megaphone, 
  ShoppingCart, 
  Truck, 
  MessageCircle, 
  Archive,
  Store,
  Home,
  Building,
  DollarSign
} from 'lucide-react';

const modules = [
  { id: 'dashboard', name: 'Dashboard', icon: Home, color: 'text-blue-600', path: '/dashboard' },
  { id: 'approvisionnement', name: 'Approvisionnement', icon: Package, color: 'text-green-600', path: '/approvisionnement' },
  { id: 'gestion-entreprise', name: 'Gestion d\'Entreprise', icon: Building, color: 'text-indigo-600', path: '/gestion-entreprise' },
  { id: 'gestion-rh', name: 'Gestion RH', icon: Users, color: 'text-purple-600', path: '/gestion-rh' },
  { id: 'financier', name: 'Financier', icon: DollarSign, color: 'text-emerald-600', path: '/financier' },
  { id: 'gestion-livraison', name: 'Gestion de Livraison', icon: Truck, color: 'text-blue-600', path: '/gestion-livraison' },
  { id: 'relation-client', name: 'Relation Client', icon: MessageCircle, color: 'text-teal-600', path: '/relation-client' },
  { id: 'marketing', name: 'Marketing', icon: Megaphone, color: 'text-pink-600', path: '/marketing' },
  { id: 'commandes', name: 'Commandes', icon: ShoppingCart, color: 'text-orange-600', path: '/commandes' },
  { id: 'stock', name: 'Stocks', icon: Archive, color: 'text-gray-600', path: '/stock' },
  { id: 'boutiques', name: 'Boutiques', icon: Store, color: 'text-red-600', path: '/boutiques' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-white h-full w-64 shadow-lg border-r border-gray-200 fixed left-0 top-0 z-30">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CODSuite</h1>
            <p className="text-xs text-gray-500">Gestion d'entreprise</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-3 pb-20">
        <div className="space-y-1">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = location.pathname === module.path;
            return (
              <Link
                key={module.id}
                to={module.path}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-50 group ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : module.color} transition-colors`} />
                <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                  {module.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;