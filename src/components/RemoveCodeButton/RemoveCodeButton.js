import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RemoveCodeSection from "../RemoveCodeSection/RemoveCodeSection";
import RemoveCodeTile from "../RemoveCodeTile/RemoveCodeTile";
import { database, query, ref } from "../../apis/firebase";
import { equalTo, orderByValue } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { useGroup } from "../../contexts/GroupContext";
import { useListKeys } from "react-firebase-hooks/database";

const RemoveCodeButton = () => {
  const { currentUser } = useAuth();
  const { groupValue } = useGroup();
  const [showModalAdd, setShowModalAdd] = useState(false);

  const handleCardClick = () => {
    setShowModalAdd(!showModalAdd);
  };
  const handleClose = () => {
    setShowModalAdd(false);
  };

  const codeQuery = query(
    ref(database, `groups/${groupValue}/codes/`),
    orderByValue(),
    equalTo(currentUser.uid)
  );
  const [keys] = useListKeys(codeQuery);

  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, [setIsMounted]);

  return (
    <>
      {isMounted && !!keys?.length && (
        <>
          <Button variant="secondary" onClick={handleCardClick}>
            −
          </Button>
          <Modal show={showModalAdd} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Remove QR Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <RemoveCodeSection
                codeKeys={keys}
                codeObject={(props) => (
                  <RemoveCodeTile
                    handleClose={handleClose}
                    {...props}
                  ></RemoveCodeTile>
                )}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default RemoveCodeButton;
