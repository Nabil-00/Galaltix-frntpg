// Firebase Configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkhoxaXkhk3aZZr8yu6EcGiLOzgOIxz_Y",
  authDomain: "galaltix-53d73.firebaseapp.com",
  projectId: "galaltix-53d73",
  storageBucket: "galaltix-53d73.firebasestorage.app",
  messagingSenderId: "270103226613",
  appId: "1:270103226613:web:ae040f94481902ba637dbc",
  measurementId: "G-XSVP2V5SX7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Analytics (optional)
const analytics = firebase.analytics();
