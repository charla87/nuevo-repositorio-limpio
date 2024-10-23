import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_URL = 'https://quartzites-hub.netlify.app/server';

const getAuthToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return token;
  }
  throw new Error('User not authenticated');
};

export const getContent = async () => {
  const token = await getAuthToken();
  const response = await axios.get(`${API_URL}/content`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const createContent = async (content) => {
  const token = await getAuthToken();
  const response = await axios.post(`${API_URL}/content`, content, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateContent = async (id, content) => {
  const token = await getAuthToken();
  const response = await axios.put(`${API_URL}/content/${id}`, content, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteContent = async (id) => {
  const token = await getAuthToken();
  await axios.delete(`${API_URL}/content/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
