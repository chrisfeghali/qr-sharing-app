import "./CollapsibleButton.css";
import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import ConditionalWrapper from "../ConditionalWrapper/ConditionalWrapper";
import { LinkContainer } from "react-router-bootstrap";

const CollapsibleButton = ({
  buttonClassName,
  parentClassName,
  startOpen = false,
  buttonName,
  children,
  conditionalStatement = null,
  buttonLink = null,
  sendOpenValue = null,
  ...props
}) => {
  const [open, setOpen] = useState(startOpen);
  const ButtonSrc = props.buttonSrc;
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
            setOpen(!open);
            sendOpenValue && sendOpenValue(open);
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
