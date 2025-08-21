import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestAuth: React.FC = () => {
  const { token, currentUser, isAuthenticated } = useAuth();

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Authentification</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Statut d'authentification:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isAuthenticated ? 'Connecté' : 'Non connecté'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">Utilisateur:</span>
          <span className="text-gray-600">{currentUser || 'Aucun'}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">Token:</span>
          <span className="text-gray-600 font-mono text-sm">
            {token ? `${token.substring(0, 20)}...` : 'Aucun'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">Token complet:</span>
          <span className="text-gray-600 font-mono text-xs break-all">
            {token || 'Aucun'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestAuth;
