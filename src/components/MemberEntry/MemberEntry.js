import {
  database,
  ref,
  RemoveMemberfromGroup,
  LeaveGroup,
  MakeAdmin,
  UnMakeAdmin,
} from "../../apis/firebase";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

import { useObjectVal } from "react-firebase-hooks/database";
import { useGroup } from "../../contexts/GroupContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MemberEntry = ({ memberKey, memberVal }) => {
  const { currentUser } = useAuth();
  const { admin, groupValue } = useGroup();
  const [username] = useObjectVal(
    ref(database, `users/${memberKey}/username/`)
  );
  const navigate = useNavigate();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLeaveGroup = async () => {
    try {
      await LeaveGroup(groupValue, memberKey);
      navigate("/home/homepage");
    } catch (err) {
      setErrorMessage(err.message);
      setShowError(true);
    }
  };

  const handleRemoveMember = async () => {
    try {
      await RemoveMemberfromGroup(groupValue, memberKey);
    } catch (err) {
      setErrorMessage(err.message);
      setShowError(true);
    }
  };

  const handleMakeAdmin = async () => {
    await MakeAdmin(groupValue, memberKey);
  };

  const handleUnMakeAdmin = async () => {
    try {
      await UnMakeAdmin(groupValue, memberKey);
    } catch (err) {
      setErrorMessage(err.message);
      setShowError(true);
    }
  };

  return (
    <>
      <ListGroup.Item
        variant="primary"
        className="d-flex justify-content-between align-items-center mb-3"
      >
        <span>{`${username} ${memberVal ? "(admin)" : ""}`}</span>
        {admin && (
          <div
            style={{ marginLeft: "10px" }}
            className="d-flex flex-column ml-2"
          >
            {!memberVal && (
              <Button
                variant="secondary"
                className="mb-2"
                onClick={handleMakeAdmin}
              >
                Make Admin
              </Button>
            )}
            {!!memberVal && (
              <Button
                variant="secondary"
                className="mb-2"
                onClick={handleUnMakeAdmin}
              >
                Unmake Admin
              </Button>
            )}
            <Button
              onClick={
                memberKey === currentUser.uid
                  ? handleLeaveGroup
                  : handleRemoveMember
              }
            >
              {memberKey === currentUser.uid ? "Leave" : "Remove"}
            </Button>
          </div>
        )}
        {!admin && memberKey === currentUser.uid && (
          <div
            style={{ marginLeft: "10px" }}
            className="d-flex flex-column ml-2"
          >
            <Button onClick={handleRemoveMember}>Leave</Button>
          </div>
        )}
      </ListGroup.Item>

      <Alert
        className="position-absolute top-25"
        variant="danger"
        show={showError}
        style={{ zIndex: 1 }}
        onClose={() => {
          setShowError(false);
        }}
        dismissible
      >
        <Alert.Heading>{errorMessage}</Alert.Heading>
      </Alert>
    </>
  );
};

export default MemberEntry;
