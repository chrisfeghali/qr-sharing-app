import "./CollapsibleButton.css";
import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import ConditionalWrapper from "../ConditionalWrapper/ConditionalWrapper";
import { LinkContainer } from "react-router-bootstrap";
import { useSidebar } from "../../contexts/SidebarContext";

const CollapsibleButton = ({
  buttonClassName,
  parentClassName,
  startOpen = false,
  buttonName,
  children,
  conditionalStatement = null,
  buttonLink = null,
  sendOpenValue = null,
  closeSidebarOnClick = false,
  ...props
}) => {
  const [open, setOpenCollapse] = useState(startOpen);
  const ButtonSrc = props.buttonSrc;
  const { setOpen } = useSidebar();
  return (
    <div className={`collapsible-button-parent ${parentClassName}`}>
      <ConditionalWrapper
        // eslint-disable-next-line no-eval
        condition={buttonLink && eval(conditionalStatement)}
        wrapper={(children) => (
          <LinkContainer to={buttonLink}>{children}</LinkContainer>
        )}
      >
        <ButtonSrc
          className={`collapsible-button ${buttonClassName}`}
          onClick={() => {
            setOpenCollapse(!open);
            sendOpenValue && sendOpenValue(open);
            if (closeSidebarOnClick && !open) {
              setOpen(false);
            }
          }}
          role="button"
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          {buttonName}
        </ButtonSrc>
      </ConditionalWrapper>
      <div className="collapsible-button-div" style={{ minLength: "1px" }}>
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
