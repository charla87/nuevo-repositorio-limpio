import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getAuthToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return token;
  }
  return null; // No lanzar error si el usuario no está autenticado
};

const axiosConfig = async () => {
  const token = await getAuthToken();
  if (token) {
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }
  return {};
};

export const getContents = async () => {
  const config = await axiosConfig();
  const response = await axios.get(`${API_URL}/content`, config);
  return response.data;
};

export const getContentById = async (id) => {
  const config = await axiosConfig();
  const response = await axios.get(`${API_URL}/content/${id}`, config);
  return response.data;
};

export const createContent = async (content) => {
  const config = await axiosConfig();
  const response = await axios.post(`${API_URL}/content`, content, config);
  return response.data;
};

export const updateContent = async (id, content) => {
  const config = await axiosConfig();
  const response = await axios.put(`${API_URL}/content/${id}`, content, config);
  return response.data;
};

export const deleteContent = async (id) => {
  const config = await axiosConfig();
  await axios.delete(`${API_URL}/content/${id}`, config);
};
