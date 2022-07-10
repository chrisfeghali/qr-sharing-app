import Button from "react-bootstrap/Button";
import { useAuth } from "../../contexts/AuthContext";

const HomePage = () => {
  const { userName, email, signOut } = useAuth();
  async function handleLogout() {
    await signOut();
  }

  return (
    <>
      <div>Home</div>
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>{userName}</div>
          <div>{email}</div>
        </div>
      </div>
      <div className="Sign-header-links">
        <Button variant="link" className="Link fs-5" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </>
  );
};

export default HomePage;
