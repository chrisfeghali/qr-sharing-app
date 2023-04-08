import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CodeSection from "../CodeSection/CodeSection";
import AddCodeTile from "../AddCodeTile/AddCodeTile";

const AddCodeButton = () => {
  const [showModalAdd, setShowModalAdd] = useState(false);

  const handleCardClick = () => {
    setShowModalAdd(!showModalAdd);
  };
  const handleClose = () => {
    setShowModalAdd(false);
  };
  return (
    <>
      <Button onClick={handleCardClick}>Add Code to Group</Button>
      <Modal show={showModalAdd} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CodeSection
            codeObject={(props) => (
              <AddCodeTile handleClose={handleClose} {...props}></AddCodeTile>
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
  );
};

export default AddCodeButton;
