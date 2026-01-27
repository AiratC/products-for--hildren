import axios from 'axios';

const fetchAxios = axios.create({
   baseURL: import.meta.env.VITE_BACKEND_URL,
   withCredentials: true
});


export default fetchAxios;