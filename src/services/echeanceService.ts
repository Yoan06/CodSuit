import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const API_URL = `${BASE_URL}/echeances/`;

export const getEcheances = (token: string) =>
  axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

export interface EcheancePayload {
  titre: string;
  description?: string;
  date_echeance: string;
  montant?: number;
  statut: 'en_attente' | 'paye' | 'retard' | 'annule';
  fournisseur?: number;
}

export const createEcheance = (data: EcheancePayload, token: string) =>
  axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateEcheance = (id: number, data: EcheancePayload, token: string) =>
  axios.put(`${API_URL}${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteEcheance = (id: number, token: string) =>
  axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  }); 