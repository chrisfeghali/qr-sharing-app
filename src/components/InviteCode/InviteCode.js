import { useState } from "react";
import { useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { DeleteInviteCode } from "../../apis/firebase";
import { useGroup } from "../../contexts/GroupContext";

const InviteCode = ({ inviteKey, inviteVal }) => {
  const location = useLocation();
  const { groupValue } = useGroup();
  const rootUrl = window.location.href.replace(location.pathname, "");
  const [buttonText, setButtonText] = useState("Copy URL");
  const inviteUrl = `${rootUrl}/join/${inviteKey}`;
  const creationTime = new Date(inviteVal).toLocaleString();
  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteUrl);
    setButtonText("Copied!");
  };
  const deleteInviteCode = async () => {
    try {
      await DeleteInviteCode(groupValue, inviteKey);
    } catch (err) {
      //console.log(err.code);
    }
  };
  return (
    <>
      <Container className="my-3">
        <Row className="align-items-center">
          <Col xs={12} md={12} lg={5}>
            <Form.Control type="text" value={inviteKey} readOnly />
            <span>{creationTime}</span>
          </Col>
          <Col xs={6} md={6} lg={4}>
            <Button variant="danger" onClick={deleteInviteCode}>
              Delete Code
            </Button>
          </Col>
          <Col xs={6} md={6} lg={3}>
            <Button variant="primary" onClick={copyInviteCode}>
              {buttonText}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default InviteCode;
