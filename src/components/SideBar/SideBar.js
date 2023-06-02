import "./SideBar.css";
import Button from "react-bootstrap/Button";
import CollapsibleBar from "../CollapsibleBar/CollapsibleBar";
import logo from "../../logo.svg";
import CollapsibleButton from "../CollapsibleButton/CollapsibleButton";
import GroupSection from "../GroupSection/GroupSection";
import { LinkContainer } from "react-router-bootstrap";
import ProfileSection from "../ProfileSection/ProfileSection";
import { useAuth } from "../../contexts/AuthContext";
import { useSidebar } from "../../contexts/SidebarContext";

const SideBar = () => {
  const { signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
  };

  const { setOpen } = useSidebar();

  return (
    <div className="sidebar">
      <CollapsibleBar
        startOpen={true}
        buttonSrc={(props) => <img {...props} src={logo} alt="logo" />}
      >
        <div className="empty-space"></div>
        <LinkContainer to="/home/homepage">
          <Button
            className="sidebar-button sidebar-border-top"
            onClick={() => {
              setOpen(false);
            }}
          >
            Home
          </Button>
        </LinkContainer>
        <CollapsibleButton
          parentClassName="collapsible-border-bottom"
          buttonName="Groups"
          startOpen={true}
          buttonSrc={(props) => <Button {...props}></Button>}
        >
          <GroupSection />
        </CollapsibleButton>
        <CollapsibleButton
          parentClassName="collapsible-border-bottom"
          buttonName="Profile"
          startOpen={false}
          buttonSrc={(props) => <Button {...props}></Button>}
        >
          <ProfileSection />
          <LinkContainer to="/home/my-codes">
            <Button
              className="sidebar-button final"
              onClick={() => {
                setOpen(false);
              }}
            >
              My Codes
            </Button>
          </LinkContainer>
          <LinkContainer to="/home/edit-profile">
            <Button
              className="sidebar-button sidebar-border-top final"
              onClick={() => {
                setOpen(false);
              }}
            >
              Edit Profile
            </Button>
          </LinkContainer>
          <Button
            className="sidebar-button sidebar-border-top final"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </CollapsibleButton>
        <div className="empty-space"></div>
      </CollapsibleBar>
    </div>
  );
};

export default SideBar;
