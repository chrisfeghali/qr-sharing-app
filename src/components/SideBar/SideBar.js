import "./SideBar.css";
import Button from "react-bootstrap/Button";
import CollapsibleBar from "../CollapsibleBar/CollapsibleBar";
import logo from "../../logo.svg";
import CollapsibleButton from "../CollapsibleButton/CollapsibleButton";
import GroupSection from "../GroupSection/GroupSection";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../../contexts/AuthContext";

const SideBar = () => {
  const { userName, email } = useAuth();

  return (
    <div className="sidebar">
      <CollapsibleBar
        startOpen={true}
        buttonSrc={(props) => <img {...props} src={logo} alt="logo" />}
      >
        <div className="empty-space"></div>
        <LinkContainer to="/home/homepage">
          <Button className="sidebar-button sidebar-border-top">Home</Button>
        </LinkContainer>
        <CollapsibleButton
          parentClassName="collapsible-border-bottom"
          buttonName="Groups"
          startOpen={true}
          buttonSrc={(props) => <Button {...props}></Button>}
        >
          <GroupSection></GroupSection>
        </CollapsibleButton>
        <CollapsibleButton
          parentClassName="collapsible-border-bottom"
          buttonName="Profile"
          startOpen={false}
          buttonSrc={(props) => <Button {...props}></Button>}
        >
          <div className="h5 final">{userName}</div>
          <div className="h5 final">{email}</div>
          <LinkContainer to="/home/edit-profile">
            <Button className="sidebar-button sidebar-border-top final">
              Edit Profile
            </Button>
          </LinkContainer>
          <Button className="final">My Codes</Button>
        </CollapsibleButton>
        <div className="empty-space"></div>
      </CollapsibleBar>
    </div>
  );
};

export default SideBar;
