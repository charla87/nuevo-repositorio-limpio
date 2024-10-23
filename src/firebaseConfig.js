import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBefAM5saHfGgY8QDheR8RGhUdRgG_4DzA",
  authDomain: "quartzite-hub.firebaseapp.com",
  projectId: "quartzite-hub",
  storageBucket: "quartzite-hub.appspot.com",
  messagingSenderId: "350182192654",
  appId: "1:350182192654:web:cfcca5dbccc93941082e5f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { db, auth, googleProvider, storage };
