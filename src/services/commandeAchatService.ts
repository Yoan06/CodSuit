import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const API_URL = `${BASE_URL}/commandes-achat/`;

export const getCommandesAchat = (token: string) =>
  axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

export interface CommandeAchatPayload {
  numero: string;
  produit: number;
  fournisseur: number;
  quantite: number;
  prix_unitaire: number;
  date_commande: string;
  date_livraison_prevue: string;
  statut: 'en_attente' | 'confirmee' | 'en_livraison' | 'livree' | 'annulee';
}

export const createCommandeAchat = (data: CommandeAchatPayload, token: string) =>
  axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateCommandeAchat = (id: number, data: CommandeAchatPayload, token: string) =>
  axios.put(`${API_URL}${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteCommandeAchat = (id: number, token: string) =>
  axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  }); 