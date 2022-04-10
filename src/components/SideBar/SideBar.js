import "./SideBar.css";
import Button from "react-bootstrap/Button";
import CollapsibleBar from "../CollapsibleBar/CollapsibleBar";
import logo from "../../logo.svg";
import CollapsibleButton from "../CollapsibleButton/CollapsibleButton";
import GroupSection from "../GroupSection/GroupSection";
import { LinkContainer } from "react-router-bootstrap";

const SideBar = () => {
  return (
    <div className="sidebar">
      <CollapsibleBar
        startOpen={true}
        buttonSrc={(props) => <img {...props} src={logo} alt="logo" />}
      >
        <div className="empty-space"></div>
        <LinkContainer
          to="/home/homepage
        "
        >
          <Button className="sidebar-button sidebar-border-top">Home</Button>
        </LinkContainer>
        <CollapsibleButton
          buttonName="Groups"
          startOpen={true}
          buttonSrc={(props) => <Button {...props}></Button>}
        >
          <GroupSection></GroupSection>
        </CollapsibleButton>
        <CollapsibleButton
          buttonName="Profile"
          startOpen={false}
          buttonSrc={(props) => <Button {...props}></Button>}
        >
          <div className="h1">HELLO!</div>
          <Button>Test</Button>
        </CollapsibleButton>
        <div className="empty-space"></div>
      </CollapsibleBar>
    </div>
  );
};

export default SideBar;
