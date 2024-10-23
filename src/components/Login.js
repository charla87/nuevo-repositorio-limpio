import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { generateCustomToken, signInWithCustomToken } from '../services/auth';

const Login = ({ onLogin }) => {
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await generateCustomToken(user.uid);
      await signInWithCustomToken(token);
      onLogin();
    } catch (error) {
      setError(error.message);
      console.error("Error during sign-in: ", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
