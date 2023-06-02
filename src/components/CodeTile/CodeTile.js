import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import {
  GetCurrentTime,
  database,
  ref,
  ResetStrikes,
} from "../../apis/firebase";
import { useObjectVal } from "react-firebase-hooks/database";
import QRCode from "../QRCode/QRCode";
import { useForm } from "react-hook-form";
import InputField from "../inputfield/InputField";
import { UpdateCode, DeleteCode, CleanCode } from "../../apis/firebase";

const CodeTile = ({ codeKey, ...props }) => {
  const [code] = useObjectVal(ref(database, `codes/${codeKey}`));
  const [strikes, setStrikes] = useState(0);
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
    const runCleanCode = async () => {
      await CleanCode(codeKey);
    };

    if (!code) {
      return;
    }

    setValue("Name", code.name);
    setValue("Uses per day", code.usesPerDay);
    setValue("Uses left today", code.usesLeft);
    setStrikes(code?.writable?.strikes);
    runCleanCode();
  }, [code, codeKey, setValue]);

  const onSubmit = async (data) => {
    const updatedCode = {
      name: data["Name"],
      usesPerDay: +data["Uses per day"],
      groups: [null],
      writable: {
        reserved: false,
        lastUsed: await GetCurrentTime(),
        usesLeft: +data["Uses left today"],
        strikes: strikes,
      },
    };
    try {
      await UpdateCode(codeKey, updatedCode);
      //console.log(updatedCode);
      handleClose();
    } catch (err) {
      //console.log(err);
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
      {!!code && (
        <>
          <Card
            style={{
              margin: "0 auto",
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
                {!!strikes && (
                  <Button
                    onClick={async () => {
                      await ResetStrikes(codeKey);
                    }}
                  >
                    Reset Strikes ({strikes})
                  </Button>
                )}
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
                  validate={(value) =>
                    value <= watch("Uses per day") ||
                    "Must be less than Uses per day"
                  }
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
      )}
    </>
  );
};

export default CodeTile;
