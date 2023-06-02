import { useEffect, useState, useCallback } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputField from "../inputfield/InputField";
import QRCode from "../QRCode/QRCode";
import { useForm } from "react-hook-form";
import { CreateCode, GetCurrentTime } from "../../apis/firebase";

const AddQRModal = ({ text, show, onShowChange }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm({
    mode: "onBlur", // "onChange"
    defaultValues: {
      Name: "",
      "Uses per day": 5,
      "Uses left today": 5,
    },
  });

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, isSubmitSuccessful, reset]);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = useCallback(() => {
    onShowChange(false);
  }, [onShowChange]);

  const onSubmit = async (data) => {
    const code = {
      val: text,
      name: data["Name"],
      usesPerDay: +data["Uses per day"],
      groups: [null],
      writable: {
        reserved: false,
        lastUsed: await GetCurrentTime(),
        usesLeft: +data["Uses left today"],
        strikes: 0,
      },
    };
    try {
      await CreateCode(code);
      handleClose();
    } catch (err) {
      if (err.code === "PERMISSION_DENIED") {
        setErrorMessage(
          "This code has already been registered. If it's yours, please contact me"
        );
      } else {
        setErrorMessage(`Error adding code. Reason: ${err.code}`);
        console.error(err);
      }
      handleClose();
      setShowError(true);
    }
  };

  if (watch("Uses left today") > watch("Uses per day")) {
    setValue("Uses left today", watch("Uses per day"));
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            className="Sign-form "
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <QRCode text={text} />
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
            <Button style={{ display: "none" }} type="submit">
              Add code
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            Add code
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
  );
};

export default AddQRModal;
