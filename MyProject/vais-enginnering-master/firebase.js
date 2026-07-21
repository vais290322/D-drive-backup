// / Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWjlc22_kwqQQItJhMBIQji4Ef3rrMK_o",
  authDomain: "vais-dce67.firebaseapp.com",
  projectId: "vais-dce67",
  storageBucket: "vais-dce67.firebasestorage.app",
  messagingSenderId: "760425110387",
  appId: "1:760425110387:web:49a96a55d9a1d413930306",
  measurementId: "G-16K5RLCKQT"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db , app };









