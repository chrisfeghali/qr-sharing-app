import logo from "../../logo.svg";
import "./Signup.css";
import { Routes, Route, Link } from "react-router-dom";

function Signup(props) {
  console.log(`database in app is ${props.dataBase}`);
  return (
    <div className="Signup">
      <h1>Signup</h1>
      <div className="Signup-contents">
        <div className="Signup-left">
          <img src={logo} className="Signup-logo" alt="logo" />
        </div>
        <div className="Signup-right">
          <p>Share QR codes with your friends and family</p>
          <Link to="/signup" className="Signup-link">
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

export default Signup;
