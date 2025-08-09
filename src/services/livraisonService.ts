import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const API_URL = `${BASE_URL}/livraisons/`;

export const getLivraisons = (token: string) =>
  axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

export interface LivraisonPayload {
  numero_commande: string;
  produit: number;
  quantite: number;
  date_livraison: string;
  statut: 'a_livrer' | 'en_cours' | 'livree';
  bon_livraison_numero?: string;
  livreur?: string;
}

export const createLivraison = (data: LivraisonPayload, token: string) =>
  axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateLivraison = (id: number, data: LivraisonPayload, token: string) =>
  axios.put(`${API_URL}${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteLivraison = (id: number, token: string) =>
  axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  }); 