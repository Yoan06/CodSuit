import axios from 'axios';

const API_URL = '/api/historique-lieux/';

export interface HistoriqueLieu {
  id: number;
  import_transit: number;
  lieu: string;
  date_passage: string;
  description?: string;
  statut: 'en_cours' | 'termine' | 'retarde';
  notes?: string;
  ordre: number;
  date_creation: string;
}

export interface CreateHistoriqueLieuPayload {
  import_transit: number;
  lieu: string;
  date_passage: string;
  description?: string;
  statut?: 'en_cours' | 'termine' | 'retarde';
  notes?: string;
  ordre?: number;
}

export interface UpdateHistoriqueLieuPayload {
  lieu?: string;
  date_passage?: string;
  description?: string;
  statut?: 'en_cours' | 'termine' | 'retarde';
  notes?: string;
  ordre?: number;
}

// Récupérer l'historique des lieux pour un import spécifique
export const getHistoriqueLieux = async (token: string, importTransitId?: number) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  if (importTransitId) {
    return axios.get(`${API_URL}?import_transit=${importTransitId}`, config);
  }
  return axios.get(API_URL, config);
};

// Récupérer un historique de lieu spécifique
export const getHistoriqueLieu = async (token: string, id: number) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios.get(`${API_URL}${id}/`, config);
};

// Créer un nouveau lieu dans l'historique
export const createHistoriqueLieu = async (token: string, data: CreateHistoriqueLieuPayload) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios.post(API_URL, data, config);
};

// Mettre à jour un lieu dans l'historique
export const updateHistoriqueLieu = async (token: string, id: number, data: UpdateHistoriqueLieuPayload) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios.patch(`${API_URL}${id}/`, data, config);
};

// Supprimer un lieu de l'historique
export const deleteHistoriqueLieu = async (token: string, id: number) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios.delete(`${API_URL}${id}/`, config);
};
