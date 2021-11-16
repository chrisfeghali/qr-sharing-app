import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfigString = JSON.stringify(
  process.env.REACT_APP_FIREBASE_CONFIG
);
console.log(`Firebase config is ${firebaseConfigString}`);

const firebaseConfig = JSON.parse(JSON.parse(firebaseConfigString));

console.log(`Firebase config parsed is ${firebaseConfig}`);

// // Your web app's Firebase configuration
// const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
// Initialize Firebase
initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/*" element={<App />} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
