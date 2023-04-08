import { useEffect, useState, useCallback } from "react";
import { Alert, Form, Button, Modal } from "react-bootstrap";
import InputField from "../inputfield/InputField";
import QRCode from "../QRCode/QRCode";
import { useForm } from "react-hook-form";
import { CreateCode } from "../../apis/firebase";

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
      "Minutes between uses": 30,
      "Reservation Time (minutes)": 10,
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
      await CreateCode(code);
      handleClose();
    } catch (err) {
      if (err.code === "PERMISSION_DENIED") {
        setErrorMessage(
          "This code has already been registered. If it's yours, please contact me"
        );
      } else {
        setErrorMessage(`Error adding code. Reason: ${err.code}`);
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
  );
};

export default AddQRModal;
