import axios from 'axios';

// Auto-Switch: Local par http://localhost:5000 aur Live (Vercel) par Render backend!
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://eventease-backend-1-ptzp.onrender.com');

const API = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor for JWT Authorization Token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;