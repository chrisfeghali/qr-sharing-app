import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "./redux/configureStore";
const store = configureStore();

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const userid = 1;
const firstName = ref(database, "Users/" + userid + "/name");
let firstNameVal = "";

onValue(firstName, (snapshot) => {
  firstNameVal = snapshot.val();
  console.log(firstNameVal);
});

console.log(firstNameVal);

console.log(database);

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <Router>
        <App />
      </Router>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
