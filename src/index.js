import React from "react";
import ReactDOM from "react-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.scss";
import App from "./App";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { app } from "./apis/firebase";
import { getDatabase, ref, onValue } from "firebase/database";

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
    <Router basename="/qr-sharing-app">
      <Routes>
        {/* <Route path="/" element={<Navigate replace to="/qr-sharing-app" />} /> */}
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
