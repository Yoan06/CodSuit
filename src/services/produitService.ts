import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const API_URL = `${BASE_URL}/produits/`;

export const getProduits = (token: string) =>
  axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

export interface ProduitPayload {
  nom: string;
  categorie: string;
  fournisseur: number;
  prix: number;
  stock_actuel: number;
  description?: string | null;
  date_lancement?: string | null;
  statut: 'actif' | 'inactif' | 'fin_de_vie';
  saisons?: number[];
}

export const createProduit = (data: ProduitPayload, token: string) =>
  axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateProduit = (id: number, data: ProduitPayload, token: string) =>
  axios.put(`${API_URL}${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteProduit = (id: number, token: string) =>
  axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  }); 