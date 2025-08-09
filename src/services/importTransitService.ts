import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const API_URL = `${BASE_URL}/import-transit/`;

export interface ImportTransitPayload {
  numero_commande: string;
  produit: number;
  fournisseur: number;
  quantite: number;
  pays_origine: string;
  region_actuelle: string;
  lieu_actuel: string;
  statut: 'en_transit' | 'douane' | 'livre' | 'bloque';
  date_expedition: string;
  date_livraison_prevue: string;
  transporteur: string;
  numero_suivi: string;
}

export const getImportTransits = (token: string) =>
  axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createImportTransit = (data: ImportTransitPayload, token: string) =>
  axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateImportTransit = (id: number, data: ImportTransitPayload, token: string) =>
  axios.put(`${API_URL}${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteImportTransit = (id: number, token: string) =>
  axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Service pour les étapes de transit
const ETAPES_API_URL = `${BASE_URL}/etapes-transit/`;

export interface EtapeTransitPayload {
  import_transit: number;
  lieu: string;
  date: string;
  statut: string;
  description: string;
  ordre?: number;
}

export const getEtapesTransit = (token: string) =>
  axios.get(ETAPES_API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createEtapeTransit = (data: EtapeTransitPayload, token: string) =>
  axios.post(ETAPES_API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateEtapeTransit = (id: number, data: EtapeTransitPayload, token: string) =>
  axios.put(`${ETAPES_API_URL}${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteEtapeTransit = (id: number, token: string) =>
  axios.delete(`${ETAPES_API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  }); 