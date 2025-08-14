import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import TestAuth from '../TestAuth';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Chiffre d\'affaires',
      value: '1,234,567 €',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Commandes',
      value: '2,847',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Clients',
      value: '1,528',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Produits',
      value: '856',
      change: '+3.1%',
      trend: 'up',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'success',
      message: 'Nouvelle commande #CMD-2024-001 reçue',
      time: 'Il y a 2 minutes',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'warning',
      message: 'Stock faible pour le produit "Smartphone XYZ"',
      time: 'Il y a 15 minutes',
      icon: AlertCircle
    },
    {
      id: 3,
      type: 'info',
      message: 'Livraison programmée pour 14h30',
      time: 'Il y a 1 heure',
      icon: Clock
    },
    {
      id: 4,
      type: 'success',
      message: 'Paiement de 2,500 € reçu',
      time: 'Il y a 2 heures',
      icon: CheckCircle
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue dans votre espace de gestion CODSuite</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Test d'Authentification */}
      <div className="mb-6">
        <TestAuth />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Activité récente</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              const getColorClass = (type: string) => {
                switch (type) {
                  case 'success':
                    return 'text-green-500 bg-green-50';
                  case 'warning':
                    return 'text-yellow-500 bg-yellow-50';
                  case 'info':
                    return 'text-blue-500 bg-blue-50';
                  default:
                    return 'text-gray-500 bg-gray-50';
                }
              };
              
              return (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${getColorClass(activity.type)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions rapides</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nouvelle commande</p>
                <p className="text-xs text-gray-500">Créer une commande client</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 bg-green-50 rounded-lg">
                <Package className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Ajouter produit</p>
                <p className="text-xs text-gray-500">Nouveau produit au catalogue</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nouveau client</p>
                <p className="text-xs text-gray-500">Ajouter un client</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 bg-orange-50 rounded-lg">
                <DollarSign className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Créer devis</p>
                <p className="text-xs text-gray-500">Nouveau devis client</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;