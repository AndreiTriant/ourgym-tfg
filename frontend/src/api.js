// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // gracias al proxy de Vite
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // habilita el envío automático de cookies
});

export default api;
