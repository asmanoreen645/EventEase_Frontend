import axios from 'axios';

// 🤖 Auto-Switch Logic: Agar browser localhost par hai to local URL chalao, warna Render!
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://eventease-backend-1-ptzp.onrender.com';
const API = axios.create({
  baseURL: BASE_URL,
});

// Har request mein automatically token attach ho
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  console.log("ACTIVE BACKEND:", req.baseURL);
  console.log("REQUEST JA RAHI HAI:", req.baseURL + req.url);
  return req;
});

export default API;