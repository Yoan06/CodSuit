import React, { useState } from 'react';

const TestAPI: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    setResult('Test en cours...');
    
    try {
      console.log('🔐 Test d\'authentification...');
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'test',
          password: 'test12345'
        })
      });
      
      console.log('📡 Réponse:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Token reçu:', data);
        setResult(`✅ Authentification réussie! Token: ${data.access.substring(0, 20)}...`);
        
        // Test avec le token
        testAPIWithToken(data.access);
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur:', errorText);
        setResult(`❌ Erreur d'authentification: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('❌ Erreur de connexion:', err);
      setResult('❌ Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const testAPIWithToken = async (token: string) => {
    try {
      console.log('📡 Test API avec token...');
      const response = await fetch('http://localhost:8000/api/echeances/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 Réponse API:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Données reçues:', data);
        setResult(prev => prev + `\n✅ API échéances accessible! ${data.length} échéances trouvées.`);
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur API:', errorText);
        setResult(prev => prev + `\n❌ Erreur API: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('❌ Erreur API:', err);
      setResult(prev => prev + '\n❌ Erreur de connexion à l\'API');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Test de l'API Django</h2>
      <button 
        onClick={testAuth}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Test en cours...' : 'Tester l\'API'}
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TestAPI; 