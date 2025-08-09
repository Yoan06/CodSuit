import axios from 'axios';

// Vite: utiliser import.meta.env.VITE_API_URL, sinon fallback local
const API_URL = import.meta.env.VITE_API_URL ??  'http://localhost:8000/api';

export const getSaisons = (token: string) =>
  axios.get(`${API_URL}/saisons/`, { headers: { Authorization: `Bearer ${token}` } });

export const createSaison = (token: string, data: { nom: string }) =>
  axios.post(`${API_URL}/saisons/`, data, { headers: { Authorization: `Bearer ${token}` } });

export const updateSaison = (token: string, id: number, data: { nom: string }) =>
  axios.put(`${API_URL}/saisons/${id}/`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteSaison = (token: string, id: number) =>
  axios.delete(`${API_URL}/saisons/${id}/`, { headers: { Authorization: `Bearer ${token}` } });