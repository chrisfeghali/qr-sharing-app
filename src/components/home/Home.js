import "./Home.css";
import SideBar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../../contexts/SidebarContext";

function Home() {
  return (
    <div className="Home">
      <SidebarProvider>
        <SideBar />
      </SidebarProvider>
      <div className="Home-contents">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
