import "./Home.css";
import SideBar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div className="Home">
      <SideBar />
      <div className="Home-contents">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
