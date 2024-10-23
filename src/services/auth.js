import { getAuth, signInWithCustomToken as firebaseSignInWithCustomToken } from 'firebase/auth';
import axios from 'axios';

export const generateCustomToken = async (uid) => {
  const response = await axios.post('http://localhost:5000/generateToken', { uid });
  return response.data.token;
};

export const signInWithCustomToken = async (token) => {
  const auth = getAuth();
  await firebaseSignInWithCustomToken(auth, token);
};
