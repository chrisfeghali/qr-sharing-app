import { useState, useEffect } from "react";
import { Card, Modal, Form, Button, Alert } from "react-bootstrap";
import { database, ref } from "../../apis/firebase";
import { useObjectVal } from "react-firebase-hooks/database";
import QRCode from "../QRCode/QRCode";
import { useForm } from "react-hook-form";
import InputField from "../inputfield/InputField";
import { UpdateCode, DeleteCode } from "../../apis/firebase";

const CodeTile = ({ codeKey, ...props }) => {
  const [code, loading, error] = useObjectVal(
    ref(database, `codes/${codeKey}`)
  );
  const [showModal, setShowModal] = useState(false);
  const handleCardClick = () => {
    setShowModal(!showModal);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      await DeleteCode(codeKey);
    } catch (err) {
      setErrorMessage(`Error adding code. Reason: ${err.code}`);
      handleClose();
      setShowError(true);
    }
  };

  useEffect(() => {
    if (!loading && !!code) {
      setValue("Name", code.name);
      setValue("Uses per day", code.usesPerDay);
      setValue("Uses left today", code.usesLeft);
      setValue("Minutes between uses", code.minutesBetweenUses);
      setValue("Reservation Time (minutes)", code.reservationTime);
    }
  }, [loading, error, code, setValue]);

  const onSubmit = async (data) => {
    const updatedCode = {
      name: data["Name"],
      usesPerDay: data["Uses per day"],
      usesLeft: data["Uses left today"],
      minutesBetweenUses: data["Minutes between uses"],
      reservationTime: data["Reservation Time (minutes)"],
      groups: [null],
      writable: {
        reserved: false,
        lastUsed: 0,
        usesLeft: 5,
      },
    };
    try {
      await UpdateCode(codeKey, updatedCode);
      handleClose();
    } catch (err) {
      setErrorMessage(`Error adding code. Reason: ${err.code}`);
      handleClose();
      setShowError(true);
    }
  };

  if (watch("Uses left today") > watch("Uses per day")) {
    setValue("Uses left today", watch("Uses per day"));
  }
  return (
    <>
      {!loading && !error && code !== null && (
        <>
          <Card
            style={{
              width: "15rem",
              cursor: "pointer",
            }}
            onClick={handleCardClick}
          >
            <QRCode text={code.val} />
            <Card.Title
              style={{
                color: "black",
                textAlign: "center",
              }}
            >
              {code.name}
            </Card.Title>
          </Card>
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit QR Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form
                className="Sign-form "
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <QRCode text={code.val} />
                <InputField
                  label="Name"
                  register={register}
                  type="text"
                  errors={errors}
                  required={true}
                />
                <InputField
                  label="Uses per day"
                  register={register}
                  type="number"
                  step={1}
                  min={1}
                  max={1500}
                  required={true}
                  errors={errors}
                />
                <InputField
                  label="Uses left today"
                  register={register}
                  type="number"
                  step={1}
                  min={0}
                  max={watch("Uses per day")}
                  required={true}
                  errors={errors}
                />
                <InputField
                  label="Minutes between uses"
                  register={register}
                  type="number"
                  step={1}
                  min={0}
                  max={1500}
                  required={true}
                  errors={errors}
                />
                <InputField
                  label="Reservation Time (minutes)"
                  register={register}
                  type="number"
                  step={1}
                  min={1}
                  max={1500}
                  required={true}
                  errors={errors}
                />
                <Button style={{ display: "none" }} type="submit">
                  Update Code
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleDelete}>
                Delete Code
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit(onSubmit)}>
                Update code
              </Button>
            </Modal.Footer>
          </Modal>
          <Alert
            className="position-absolute top-25 start-50 translate-middle"
            variant="danger"
            show={showError}
            onClose={() => {
              setShowError(false);
            }}
            dismissible
          >
            <Alert.Heading>{errorMessage}</Alert.Heading>
          </Alert>
        </>
      )}
    </>
  );
};

export default CodeTile;
