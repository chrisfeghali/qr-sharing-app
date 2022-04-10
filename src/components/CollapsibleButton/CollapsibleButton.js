import "./CollapsibleButton.css";
import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";

const CollapsibleButton = ({ startOpen, buttonName, children, ...props }) => {
  const [open, setOpen] = useState(startOpen);
  const ButtonSrc = props.buttonSrc;
  return (
    <div className="collapsible-button-parent">
      <ButtonSrc
        className="collapsible-button"
        onClick={() => setOpen(!open)}
        role="button"
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        {buttonName}
      </ButtonSrc>
      <div style={{ minLength: "1px" }}>
        <Collapse
          className="collapsible-button-content"
          in={open}
          appear={true}
        >
          <div className="collapsible-children">{children}</div>
        </Collapse>
      </div>
    </div>
  );
};

export default CollapsibleButton;
