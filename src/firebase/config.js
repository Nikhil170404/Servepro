import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  GoogleAuthProvider 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCrlWG2qauLzbSOHmAj2Uy4ImgH1qDDX6Y",
  authDomain: "service-7d2d4.firebaseapp.com",
  projectId: "service-7d2d4",
  storageBucket: "service-7d2d4.appspot.com",
  messagingSenderId: "257811466401",
  appId: "1:257811466401:web:60c5516d2e3465996b88e0",
  measurementId: "G-KVPJZGB5TR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Set persistence to local
setPersistence(auth, browserLocalPersistence);

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, db, googleProvider };
