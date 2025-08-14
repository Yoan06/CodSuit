import React, { useEffect, useState, useCallback } from 'react';
import { getSaisons } from '../../../services/saisonService';
import { getProduits } from '../../../services/produitService';

interface Saison { id: number; nom: string; }
interface Produit { id: number; nom: string; saisons?: number[]; }

const Saisons: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [saisons, setSaisons] = useState<Saison[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('authToken');
    setToken(t);
  }, []);

  const fetchAll = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [sRes, pRes] = await Promise.all([
        getSaisons(token),
        getProduits(token)
      ]);
      setSaisons(sRes.data);
      setProduits(pRes.data);
    } catch (err) {
      console.error("Erreur lors du chargement des saisons/produits:", err);
      setError("Impossible de charger les saisons/produits");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) return <div className="text-gray-600">Chargement...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Saisons et produits associés</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {saisons.map((saison) => {
          const produitsDeSaison = produits.filter(p => p.saisons?.includes(saison.id));
          return (
            <div key={saison.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{saison.nom}</h3>
                <span className="text-xs text-gray-500">{produitsDeSaison.length} produit(s)</span>
              </div>
              {produitsDeSaison.length === 0 ? (
                <div className="text-sm text-gray-500">Aucun produit pour cette saison.</div>
              ) : (
                <ul className="text-sm list-disc list-inside space-y-1">
                  {produitsDeSaison.map(p => (
                    <li key={p.id}>{p.nom}</li>
                  ))}
          </ul>
              )}
        </div>
          );
        })}
      </div>
    </div>
  );
};

export default Saisons; 