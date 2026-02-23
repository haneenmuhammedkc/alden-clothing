import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDVCzwX6mpEPq_GxkxkbpMbSKm2t1ZcOZ0",
  authDomain: "alden-admin.firebaseapp.com",
  projectId: "alden-admin",
  storageBucket: "alden-admin.appspot.com",
  messagingSenderId: "1029821576384",
  appId: "1:1029821576384:web:398feeb168555393142925"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()