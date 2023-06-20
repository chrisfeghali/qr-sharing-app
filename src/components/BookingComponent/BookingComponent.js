import "./BookingComponent.css";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { GetCurrentTime } from "../../apis/firebase";
import { useGroup } from "../../contexts/GroupContext";
import Slider from "../Slider/Slider";
const BookingComponent = () => {
  const {
    codes,
    reserveTime,
    encodeInterval,
    minutesBetweenUses,
    resolutionTime,
    lookaheadHours,
  } = useGroup();

  const dayMinutes = 60;
  const daySeconds = 60;
  const dayMilliseconds = 1000;

  const heightTimeRatio = useMemo(
    () => (window.innerHeight - 250) / (lookaheadHours * dayMinutes),
    [lookaheadHours]
  );

  const [reservations, setReservations] = useState(null);
  const [reservationWindow, setReservationWindow] = useState(null);
  const [dateStartTime, setDateStartTime] = useState(null);
  const [dateEndTime, setDateEndTime] = useState(null);
  const [sliderHeight, setSliderHeight] = useState(
    heightTimeRatio * lookaheadHours * dayMinutes
  );
  const [maxNum, setMaxNum] = useState(1);
  const [maxNumMarks, setMaxNumMarks] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, [setIsMounted]);

  useEffect(() => {
    if (!!reservations && !!dateStartTime && !!dateEndTime) {
      setReservationWindow(
        encodeInterval(dateStartTime, dateEndTime, reservations)
      );
    } else {
      setReservationWindow(null);
    }
  }, [reservations, dateStartTime, dateEndTime, encodeInterval]);

  useEffect(() => {
    let aggregatedReservations = null;
    if (!!codes) {
      //console.log("code");
      //console.log(codes);
      codes.forEach((codeVal, codeKey) => {
        //console.log("in for each");
        //console.log(`aggregatedReservations: ${aggregatedReservations}`);
        //console.log(`enccodedReservations: ${codeVal?.encodedReservations}`);
        if (typeof codeVal?.encodedReservations === "bigint") {
          //console.log("In encodedReservations");
          //console.log(`enccodedReservations: ${codeVal?.encodedReservations}`);
          //console.log(codeVal);
          //console.log(codeKey, codeVal.encodedReservations);
          if (aggregatedReservations === null) {
            aggregatedReservations = codeVal.encodedReservations;
          } else {
            aggregatedReservations &= codeVal.encodedReservations;
          }
          //console.log("aggergated", aggregatedReservations);
        }
      });
      //console.log("reservationsChanged");
      //console.log(aggregatedReservations);
      //Check the aggregation is working by adding multiple codes and multiple reservations per code
      setReservations(aggregatedReservations);
    }

    // setReservations
  }, [codes]);

  useEffect(() => {
    let startTime = null;
    let endTime = null;
    let diffTime = null;
    let endOfDay = null;
    let maxNum = null;
    let maxNumMarks = null;

    const roundDownTo = (roundTo) => (x) => Math.floor(x / roundTo) * roundTo;
    const roundDownToResolutionTime = roundDownTo(1000 * 60 * resolutionTime);

    // getcurrentTime on mount
    async function getCurrentTime() {
      if (!reserveTime) {
        return;
      }
      const currentTime = await GetCurrentTime();
      startTime = new Date(currentTime);
      startTime = new Date(roundDownToResolutionTime(startTime));
      // startTime.setHours(19, 0, 0);
      //console.log(`startTime: ${startTime}`);
      const hours = startTime.getHours() + lookaheadHours;
      //console.log(`hours: ${hours}`);
      endTime = new Date(startTime);
      endTime.setHours(hours);
      endOfDay = new Date(startTime);
      endOfDay.setHours(24, 0, 0);

      diffTime = Math.min(
        Math.floor((endTime - startTime) / dayMilliseconds) / daySeconds,
        Math.floor((endOfDay - startTime) / dayMilliseconds) / daySeconds
      );
      maxNum = (diffTime - reserveTime) / resolutionTime;
      maxNumMarks = diffTime / resolutionTime;

      setSliderHeight(heightTimeRatio * diffTime);
      setMaxNum(maxNum);
      setMaxNumMarks(maxNumMarks);
      setDateStartTime(startTime);
      setDateEndTime(endTime);
      //console.log(startTime);

      setLoaded(true);
    }
    getCurrentTime();
    //console.log(`reserveTime: ${reserveTime}`);
  }, [
    reserveTime,
    minutesBetweenUses,
    heightTimeRatio,
    lookaheadHours,
    resolutionTime,
  ]);

  //draw boxes for each busy chunk in reservations
  const BusyBoxes = () => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);

    const drawRectangles = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      if (!reservationWindow) {
        return null;
      }
      //console.log(reservationWindow);
      //console.log(codes);
      let mask = BigInt(1);
      let tempWindow = reservationWindow;
      ctx.fillStyle = "#8a0bd7";
      let startHeight = 0;
      const skipBeginning = reserveTime / resolutionTime - 1;
      let skipIndex = 0;
      //console.log("skipBeginning", skipBeginning);
      while (tempWindow !== 0n) {
        if (tempWindow & mask) {
          if (skipIndex < skipBeginning && startHeight !== 0) {
            skipIndex++;
          } else {
            if (startHeight === 0) {
              skipIndex++;
            }
            // //console.log(reservationWindow);
            ctx.fillRect(
              0,
              startHeight,
              canvas.width,
              sliderHeight / maxNumMarks + 0.7
            );
          }
        } else {
          skipIndex = 0;
        }
        tempWindow >>= 1n;
        startHeight += sliderHeight / maxNumMarks;
      }
    };

    useLayoutEffect(() => {
      requestRef.current = requestAnimationFrame(drawRectangles);
      return () => window.cancelAnimationFrame(requestRef.current);
    }, []);

    return (
      <canvas
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
          border: "2px solid var(--bs-primary)",
        }}
        height={sliderHeight}
        ref={canvasRef}
      />
    );
  };

  return (
    <>
      {isMounted && loaded && (
        <div
          style={{
            position: "relative",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "20px",
            width: "100px",
            height: `${sliderHeight}px`,
          }}
        >
          <Slider
            sliderHeight={sliderHeight}
            maxNum={maxNum}
            maxNumMarks={maxNumMarks}
            reservations={reservations}
            reserveTime={reserveTime}
            resolutionTime={resolutionTime}
            dateStartTime={dateStartTime}
          />
          <BusyBoxes />
        </div>
      )}
    </>
  );
};
export default BookingComponent;
