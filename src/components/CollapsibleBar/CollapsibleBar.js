import "./CollapsibleBar.css";
import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";

const CollapsibleBar = ({ startOpen, buttonName, children, ...props }) => {
  const [open, setOpen] = useState(startOpen);
  const ButtonSrc = props.buttonSrc;

  return (
    <div className="collapsible-bar">
      <ButtonSrc
        className="collapsible-bar-button"
        onClick={() => setOpen(!open)}
        role="button"
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        {buttonName}
      </ButtonSrc>

      <div
        className="collapsible-bar-content"
        style={{ minHeight: "1px", margin: "0", padding: "0" }}
      >
        <Collapse in={open} appear={true} dimension="width">
          <div className="collapsible-bar-children">{children}</div>
        </Collapse>
      </div>
    </div>
  );
};

export default CollapsibleBar;
