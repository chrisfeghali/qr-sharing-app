// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfigString = JSON.stringify(
  process.env.REACT_APP_FIREBASE_CONFIG
);
console.log(`Firebase config is ${firebaseConfigString}`);

let firebaseConfig = JSON.parse(JSON.parse(firebaseConfigString));

if (window.location.hostname === "localhost") {
  console.log(`window location hostname is ${window.location.hostname}`);
  firebaseConfig.databaseURL = "http://localhost:9000?ns=emulatorui";
}

console.log(`Firebase config parsed is ${JSON.stringify(firebaseConfig)}`);

// // Your web app's Firebase configuration
// const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { auth, app };
