import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const API_URL = `${BASE_URL}/bons-commande/`;

export const getBonsCommande = (token: string) =>
  axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

export interface BonCommandePayload {
  numero: string;
  produit: number;
  fournisseur: number;
  date_debut: string;
  date_fin: string;
  quantite: number;
  prix_unitaire: number;
  statut: 'a_envoyer' | 'envoyee' | 'recue' | 'annulee';
}

export const createBonCommande = (data: BonCommandePayload, token: string) =>
  axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateBonCommande = (id: number, data: BonCommandePayload, token: string) =>
  axios.put(`${API_URL}${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteBonCommande = (id: number, token: string) =>
  axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  }); 