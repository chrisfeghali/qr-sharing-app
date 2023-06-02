import { useState, useEffect, useRef, useCallback } from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import CloseButton from "react-bootstrap/CloseButton";
import {
  GetCurrentTime,
  RemoveReservationFromUser,
  RemoveExpiredReservationAndIncrementUsesLeft,
  IncrementStrikes,
  database,
  ref,
  SetReservationError,
  SetReservationUsed,
} from "../../apis/firebase";
import { useObjectVal } from "react-firebase-hooks/database";

import QRCode from "../QRCode/QRCode";

const STATUS = {
  STARTED: "Started",
  STOPPED: "Stopped",
};

const TileState = {
  BEFORE: "Before",
  DURING: "During",
  AFTER: "After",
  ERROR: "Error",
};

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const twoDigits = (num) => String(num).padStart(2, "0");

const ReservationTile = ({ reservation, reservationKey, ...props }) => {
  const [group] = useObjectVal(ref(database, `groups/${reservation.groupKey}`));
  const [code] = useObjectVal(ref(database, `codes/${reservation.codeKey}`));

  const [showModal, setShowModal] = useState(false);
  const handleCardClick = () => {
    setShowModal(!showModal);
  };

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [secondsToEndState, setSecondsToEndState] = useState(Infinity);
  const [reservationState, setReservationState] = useState(TileState.ERROR);
  const [status, setStatus] = useState(STATUS.STOPPED);

  const removeReservation = useCallback(async () => {
    if (!code?.writable?.reservations?.[reservation.reservationTime]?.used) {
      await RemoveExpiredReservationAndIncrementUsesLeft(
        reservation.codeKey,
        reservation.reservationTime,
        reservationKey
      );
    }
  }, [
    code?.writable.reservations,
    reservation.codeKey,
    reservation.reservationTime,
    reservationKey,
  ]);

  const secondsToDisplay = secondsToEndState % 60;
  const minutesRemaining = (secondsToEndState - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;
  const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60;

  useInterval(
    async () => {
      if (secondsToEndState > 0) {
        setSecondsToEndState(secondsToEndState - 1);
      } else {
        await determineState();
      }
    },
    status === STATUS.STARTED ? 1000 : null
  );
  const handleCodeUsed = useCallback(async () => {
    await SetReservationUsed(reservation.codeKey, reservation.reservationTime);
    await SetReservationError(reservationKey, "Code used");
    setShowModal(false);
  }, [reservation.codeKey, reservation.reservationTime, reservationKey]);

  const determineState = useCallback(async () => {
    const currentTime = await GetCurrentTime();
    const reservationStart = reservation.reservationTime;
    const reservationEnd = reservationStart + group?.reserveTime * 60 * 1000;

    if (reservation.error === true) {
      setReservationState(TileState.ERROR);
      setErrorMessage(reservation?.message);
      setStatus(STATUS.STOPPED);
      setSecondsToEndState(0);
      return;
    }

    if (currentTime >= reservationEnd) {
      await removeReservation();
      setReservationState(TileState.AFTER);
      setStatus(STATUS.STOPPED);
      if (showModal) {
        await handleCodeUsed();
      }
    } else if (
      currentTime < reservationEnd &&
      currentTime >= reservationStart
    ) {
      setReservationState(TileState.DURING);
      setSecondsToEndState(Math.ceil((reservationEnd - currentTime) / 1000));
      setStatus(STATUS.STARTED);
    } else {
      setReservationState(TileState.BEFORE);
      setSecondsToEndState(Math.floor((reservationStart - currentTime) / 1000));
      setStatus(STATUS.STARTED);
    }
  }, [
    group?.reserveTime,
    handleCodeUsed,
    removeReservation,
    reservation.error,
    reservation?.message,
    reservation.reservationTime,
    showModal,
  ]);

  useEffect(() => {
    if (!group?.reserveTime) {
      return;
    }
    let startTime = new Date(reservation.reservationTime);
    let endTime = new Date(reservation.reservationTime);
    endTime.setMinutes(endTime.getMinutes() + group.reserveTime);

    setStartTime(startTime);
    setEndTime(endTime);

    determineState();
  }, [group?.reserveTime, reservation.reservationTime, determineState]);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(reservation.message);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleCodeFail = async () => {
    await IncrementStrikes(
      reservation.codeKey,
      code,
      reservation.groupKey,
      group
    );
    await SetReservationError(reservationKey, "Code didn't work");
    setShowModal(false);
  };

  const handleRemoveReservation = async () => {
    await removeReservation();
    await RemoveReservationFromUser(reservationKey);
  };

  return (
    <>
      {!!code && (
        <>
          <Card
            bg="dark"
            text="light"
            style={{
              margin: "0 auto",
              width: "15rem",
            }}
          >
            <Card.Title
              style={{
                color: "black",
                textAlign: "center",
              }}
            >
              <CloseButton
                aria-label="Remove Reservation"
                variant="white"
                style={{ position: "absolute", right: "0px" }}
                onClick={handleRemoveReservation}
              />
            </Card.Title>
            <Card.Body
              style={{
                textAlign: "center",
              }}
            >
              <Card.Title>{group?.name}</Card.Title>
              <Card.Title>
                {startTime.toLocaleString().substring(11, 17)} -
                {endTime.toLocaleString().substring(11, 17)}
              </Card.Title>
              <Button
                disabled={
                  reservationState === TileState.BEFORE ||
                  reservationState === TileState.AFTER ||
                  reservationState === TileState.ERROR
                }
                onClick={handleCardClick}
              >
                {reservationState === TileState.BEFORE &&
                  `${twoDigits(hoursToDisplay)}:${twoDigits(
                    minutesToDisplay
                  )}:${twoDigits(secondsToDisplay)}`}
                {reservationState === TileState.DURING &&
                  `Use Code (${twoDigits(minutesToDisplay)}:${twoDigits(
                    secondsToDisplay
                  )})`}
                {reservationState === TileState.AFTER && `Reservation Expired`}
                {reservationState === TileState.ERROR && `${errorMessage}`}
              </Button>
            </Card.Body>
          </Card>
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{group?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <QRCode text={code.val} />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={handleCodeFail}
                style={{ width: "100%" }}
              >
                The code didn't work
              </Button>
              <Button
                variant="secondary"
                onClick={handleClose}
                style={{ width: "100%" }}
              >
                I didn't use the code yet
              </Button>
              <Button
                variant="primary"
                onClick={handleCodeUsed}
                style={{ width: "100%" }}
              >
                I used the code
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

export default ReservationTile;
