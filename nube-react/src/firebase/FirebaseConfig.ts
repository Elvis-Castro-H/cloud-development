import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import * as firebaseui from "firebaseui";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHtyTxBNUPBmdEbfkL830jTZ4HBcGOzYY",
  authDomain: "cloud-development-3710c.firebaseapp.com",
  projectId: "cloud-development-3710c",
  storageBucket: "cloud-development-3710c.firebasestorage.app",
  messagingSenderId: "1078151111140",
  appId: "1:1078151111140:web:fa02bd27ee4d2521e967f1",
  measurementId: "G-HP3FP0LGN8"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const firebaseUi = new firebaseui.auth.AuthUI(firebaseAuth);
firebaseAuth.useDeviceLanguage();
export { firebaseAuth };
