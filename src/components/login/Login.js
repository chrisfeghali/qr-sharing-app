import logo from "../../logo.svg";
import "./Login.css";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import Signup from "../signup/Signup";

function Login(props) {
  console.log(`database in app is ${props.dataBase}`);
  return (
    <div className="Login">
      <div className="Login-contents">
        <div className="Login-left">
          <img src={logo} className="Login-logo" alt="logo" />
        </div>
        <div className="Login-right">
          <p>Share QR codes with your friends and family</p>
          <Link to="signup" className="Login-link">
            Sign up
          </Link>
        </div>
      </div>
      <Routes>
        <Route path="signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default Login;
