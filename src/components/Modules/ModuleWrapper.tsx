import React from 'react';

interface ModuleWrapperProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const ModuleWrapper: React.FC<ModuleWrapperProps> = ({ title, description, children }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      
      {children || (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Module en développement</h2>
          <p className="text-gray-600 mb-4">
            Ce module sera bientôt disponible avec toutes les fonctionnalités prévues.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <span className="text-sm font-medium">Prochainement disponible</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleWrapper;