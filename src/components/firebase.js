import { initializeApp } from "firebase/app";

const firebaseConfigString = JSON.stringify(
  process.env.REACT_APP_FIREBASE_CONFIG
);
console.log(`Firebase config is ${firebaseConfigString}`);

const firebaseConfig = JSON.parse(JSON.parse(firebaseConfigString));

console.log(`Firebase config parsed is ${firebaseConfig}`);

// // Your web app's Firebase configuration
// const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
