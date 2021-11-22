import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";

function App(props) {
  return (
    <div className="container-fluid">
      <Routes>
        <Route path="/" element={<Navigate replace to="/qr-sharing-app" />} />
        <Route path="/qr-sharing-app" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
