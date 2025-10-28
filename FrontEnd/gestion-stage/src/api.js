// src/api.js
import axios from './components/utils/axiosConfig'

const API_URL = "http://localhost:8080/api/stagiaires";

export const fetchStagiaires = () => axios.get(API_URL);
export const fetchStagiaire = (cin) => axios.get(`${API_URL}/${cin}`);
export const createStagiaire = (stagiaire) => axios.post(API_URL, stagiaire);
export const updateStagiaire = (cin, stagiaire) => axios.put(`${API_URL}/${cin}`, stagiaire);
export const deleteStagiaire = (cin) => axios.delete(`${API_URL}/${cin}`);
