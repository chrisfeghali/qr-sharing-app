import logo from "../../logo.svg";
import "./Landing.css";
import { Outlet } from "react-router-dom";

function Landing(props) {
  return (
    <div className="Landing">
      <div className="Landing-contents">
        <div className="Landing-left">
          <img src={logo} className="Landing-logo" alt="logo" />
        </div>
        <div className="Landing-right">
          <p>Share QR codes with your friends and family</p>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Landing;
