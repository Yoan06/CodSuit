import React, { useState } from 'react';
import { Calendar, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface Echeance {
  id: number;
  fournisseur: string;
  datePrevuePaiement: string;
  datePaiementEffectif?: string;
  dateDebutCommande: string;
  dateFinCommande: string;
  montant: number;
  statut: 'En attente' | 'Payé' | 'En retard';
  produit: string;
}

const Echeances: React.FC = () => {
  const [echeances] = useState<Echeance[]>([
    {
      id: 1,
      fournisseur: 'TechnoSupply SARL',
      datePrevuePaiement: '2024-02-15',
      datePaiementEffectif: '2024-02-14',
      dateDebutCommande: '2024-01-15',
      dateFinCommande: '2024-01-30',
      montant: 22500,
      statut: 'Payé',
      produit: 'Smartphone XYZ Pro'
    },
    {
      id: 2,
      fournisseur: 'GlobalParts Ltd',
      datePrevuePaiement: '2024-02-20',
      dateDebutCommande: '2024-01-20',
      dateFinCommande: '2024-02-05',
      montant: 18750,
      statut: 'En attente',
      produit: 'Laptop Business 15"'
    },
    {
      id: 3,
      fournisseur: 'LocalDistrib',
      datePrevuePaiement: '2024-02-10',
      dateDebutCommande: '2024-01-10',
      dateFinCommande: '2024-01-25',
      montant: 5600,
      statut: 'En retard',
      produit: 'Accessoires divers'
    }
  ]);

  const [activeCalendar, setActiveCalendar] = useState<'commandes' | 'paiements' | 'livraisons'>('paiements');

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'Payé':
        return <CheckCircle className="w-4 h-4" />;
      case 'En attente':
        return <Clock className="w-4 h-4" />;
      case 'En retard':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const isDateOverdue = (date: string, statut: string) => {
    const today = new Date();
    const targetDate = new Date(date);
    return targetDate < today && statut !== 'Payé';
  };

  const echeancesEnRetard = echeances.filter(e => e.statut === 'En retard');
  const echeancesProches = echeances.filter(e => {
    const today = new Date();
    const datePaiement = new Date(e.datePrevuePaiement);
    const diffTime = datePaiement.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0 && e.statut === 'En attente';
  });

  const renderCalendarView = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Générer les jours du mois
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    
    // Jours vides au début
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const dateString = currentDate.toISOString().split('T')[0];
      
      let eventsForDay = [];
      
      if (activeCalendar === 'paiements') {
        eventsForDay = echeances.filter(e => e.datePrevuePaiement === dateString);
      } else if (activeCalendar === 'commandes') {
        eventsForDay = echeances.filter(e => 
          e.dateDebutCommande === dateString || e.dateFinCommande === dateString
        );
      }
      
      days.push(
        <div key={day} className="h-24 border border-gray-200 p-1 overflow-hidden">
          <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
          {eventsForDay.map((event, index) => (
            <div
              key={index}
              className={`text-xs p-1 rounded mb-1 truncate ${
                activeCalendar === 'paiements' 
                  ? getStatutColor(event.statut).replace('text-', 'text-').replace('bg-', 'bg-')
                  : 'bg-blue-100 text-blue-800'
              }`}
              title={`${event.fournisseur} - ${formatCurrency(event.montant)}`}
            >
              {event.fournisseur}
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-7 gap-0">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700 border border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Échéances</h2>
          <p className="text-gray-600">Suivez vos échéances de paiement et planifiez vos commandes</p>
        </div>
      </div>

      {/* Alertes */}
      {(echeancesEnRetard.length > 0 || echeancesProches.length > 0) && (
        <div className="space-y-3">
          {echeancesEnRetard.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">Échéances en retard ({echeancesEnRetard.length})</h3>
              </div>
              <div className="space-y-2">
                {echeancesEnRetard.map(echeance => (
                  <div key={echeance.id} className="flex justify-between items-center">
                    <span className="text-red-800">{echeance.fournisseur} - {echeance.produit}</span>
                    <span className="font-medium text-red-900">{formatCurrency(echeance.montant)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {echeancesProches.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-900">Échéances à venir (7 jours) ({echeancesProches.length})</h3>
              </div>
              <div className="space-y-2">
                {echeancesProches.map(echeance => (
                  <div key={echeance.id} className="flex justify-between items-center">
                    <span className="text-yellow-800">{echeance.fournisseur} - {echeance.produit}</span>
                    <span className="font-medium text-yellow-900">{formatCurrency(echeance.montant)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sélecteur de calendrier */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveCalendar('paiements')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeCalendar === 'paiements'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Calendrier d'échéances</span>
          </button>
          <button
            onClick={() => setActiveCalendar('commandes')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeCalendar === 'commandes'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendrier des commandes</span>
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h3>
        </div>

        {renderCalendarView()}
      </div>

      {/* Liste détaillée des échéances */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Détail des échéances</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date prévue paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date paiement effectif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {echeances.map((echeance) => (
                <tr 
                  key={echeance.id} 
                  className={`hover:bg-gray-50 ${
                    isDateOverdue(echeance.datePrevuePaiement, echeance.statut) ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{echeance.fournisseur}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{echeance.produit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(echeance.dateDebutCommande).toLocaleDateString('fr-FR')} - {new Date(echeance.dateFinCommande).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      isDateOverdue(echeance.datePrevuePaiement, echeance.statut) 
                        ? 'text-red-600 font-medium' 
                        : 'text-gray-900'
                    }`}>
                      {new Date(echeance.datePrevuePaiement).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {echeance.datePaiementEffectif 
                        ? new Date(echeance.datePaiementEffectif).toLocaleDateString('fr-FR')
                        : '-'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(echeance.montant)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(echeance.statut)}`}>
                      {getStatutIcon(echeance.statut)}
                      <span>{echeance.statut}</span>
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
};

export default Echeances;