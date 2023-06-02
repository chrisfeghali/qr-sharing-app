import "./CollapsibleBar.css";
import { useCallback, useMemo } from "react";
import Collapse from "react-bootstrap/Collapse";
import { useSidebar } from "../../contexts/SidebarContext";

const CollapsibleBar = ({ startOpen, buttonName, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  const ButtonSrc = props.buttonSrc;
  const handleButtonClick = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  const buttonMemoed = useMemo(() => {
    return (
      <ButtonSrc
        className="collapsible-bar-button"
        onClick={handleButtonClick}
        role="button"
        aria-controls="example-collapse-text"
      >
        {buttonName}
      </ButtonSrc>
    );
  }, [buttonName, handleButtonClick]);

  return (
    <div className="collapsible-bar">
      {buttonMemoed}

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
