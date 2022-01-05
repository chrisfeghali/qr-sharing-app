import "./Home.css";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="Home">
      <div className="Home-contents">
        <div>Home</div>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>{currentUser.displayName}</div>
            <div>{currentUser.email}</div>
          </div>
        </div>
        <div className="Sign-header-links">
          <Button
            variant="link"
            className="Sign-link fs-5"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
