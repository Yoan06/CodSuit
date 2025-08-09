import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const API_URL = `${BASE_URL}/fournisseurs/`;

export const getFournisseurs = (token: string) =>
  axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

export interface FournisseurPayload {
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
}

export const createFournisseur = (data: FournisseurPayload, token: string) =>
  axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateFournisseur = (id: number, data: FournisseurPayload, token: string) =>
  axios.put(`${API_URL}${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteFournisseur = (id: number, token: string) =>
  axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Fonction pour l'authentification
export const login = (username: string, password: string) =>
  axios.post(`${BASE_URL}/token/`, { username, password }); // Endpoint JWT