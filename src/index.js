import React from "react";
import ReactDOM from "react-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.scss";
import App from "./App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router basename="/qr-sharing-app">
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
