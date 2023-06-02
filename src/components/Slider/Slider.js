import { useEffect, useMemo, useState } from "react";
import "./Slider.css";
import ReactSlider from "react-slider";
import { BookCode } from "../../apis/firebase";
import { useGroup } from "../../contexts/GroupContext";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const generateMarks = (startTime, maxNum, resolutionTime) => {
  const dayMinutes = 60;
  let marks = [];
  let steps = 0;

  let startTimeMinutes = startTime.getMinutes();

  startTimeMinutes === 0
    ? (steps = 0)
    : (steps = (dayMinutes - startTimeMinutes) / resolutionTime);

  while (steps <= maxNum) {
    marks.push(steps);
    steps += dayMinutes / resolutionTime;
  }
  return marks;
};

const Slider = ({
  sliderHeight,
  maxNum,
  maxNumMarks,
  reservations,
  reserveTime,
  dateStartTime,
  resolutionTime,
}) => {
  const { encodeTime, codes, groupValue } = useGroup();
  const navigate = useNavigate();
  const handleReserveCode = async (code) => {
    if (free) {
      if (!codes) {
        return;
      }
      let tempCodes = [];
      codes.forEach((codeVal, codeKey) => {
        if (typeof codeVal?.encodedReservations === "bigint") {
          tempCodes.push({
            encodedReservations: codeVal.encodedReservations,
            usesLeft: codeVal.writable.usesLeft,
            key: codeKey,
          });
        }
      });
      tempCodes.sort((a, b) => b.usesLeft - a.usesLeft);
      for (const code of tempCodes) {
        if (!(encodeTime(sliderTime) & code.encodedReservations)) {
          const result = await BookCode(
            code.key,
            sliderTime.getTime(),
            groupValue
          );
          if (result) {
            navigate("/home/homepage");
            break;
          }
        }
      }
    }
  };

  const marks = useMemo(
    () => generateMarks(dateStartTime, maxNumMarks, resolutionTime),
    [dateStartTime, maxNumMarks, resolutionTime]
  );

  const [sliderTime, setSliderTime] = useState(null);
  const [free, setFree] = useState(false);
  const [sliderCounter, setSliderCounter] = useState(0);
  const [maxReservations, setMaxReservations] = useState(false);

  const isFree = useMemo(
    () => (time) => {
      if (reservations === null) {
        return false;
      }
      return !(encodeTime(time) & reservations);
    },
    [reservations, encodeTime]
  );

  useEffect(() => {
    const bits = (24 * 60) / resolutionTime;
    const maxReservations = (BigInt(1) << BigInt(bits)) - 1n;
    setMaxReservations(reservations === maxReservations);
  }, [reservations, resolutionTime]);

  useEffect(() => {
    const time = new Date(dateStartTime);
    time.setMinutes(time.getMinutes());
    setSliderTime(time);

    setFree(isFree(time));
    setSliderCounter((v) => {
      //console.log("sliderCounter", v + 1);
      return v + 1;
    });
  }, [dateStartTime, isFree]);

  return (
    <>
      {maxNum !== undefined && maxNum !== null && (
        <>
          {" "}
          <ReactSlider
            className="vertical-slider"
            markClassName="slider-mark"
            thumbClassName="slider-thumb"
            defaultValue={[0]}
            ariaLabel={["Thumb"]}
            key={sliderCounter}
            renderThumb={(props, state) => {
              let thumbHeight =
                (sliderHeight * (reserveTime / resolutionTime)) / maxNum;

              let thumbStyle = {
                backgroundColor: "black",
                color: "white",
                textAlign: "center",
                cursor: "grab",
                border: "2px solid var(--bs-primary)",
                boxSizing: "border-box",
                width: "150%",
                height: `${thumbHeight}px`,
                margin: "auto",
                borderRadius: "50px",
                flexShrink: "0",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                position: "relative",
              };

              let startTime = new Date(dateStartTime);
              startTime.setMinutes(
                startTime.getMinutes() + resolutionTime * state.valueNow
              );
              let endTime = new Date(startTime);
              endTime.setMinutes(startTime.getMinutes() + reserveTime);

              return (
                <div {...props}>
                  <div style={thumbStyle}>
                    {startTime.toLocaleString().substring(11, 17)} -
                    {endTime.toLocaleString().substring(11, 17)}
                  </div>
                  <div
                    style={{
                      cursor: "grab",
                      position: "absolute",
                      top: `${thumbHeight / 2}px`,
                      left: "0px",
                    }}
                  >
                    <div
                      style={{
                        zIndex: "-2",
                        position: "absolute",
                        strokeWidth: "15",
                        stroke: "var(--bs-primary)",
                        strokeLinejoin: "round",
                        strokeLinecap: "round",
                        rotate: "90deg",
                        transform: "translate(-50%, 100%)",
                        fill: "var(--bs-primary)",
                      }}
                    >
                      <svg width="100" height="100">
                        <path d="M 50,10 90,90 10,90 z" />
                      </svg>
                    </div>
                    <div
                      style={{
                        zIndex: "2",
                        position: "absolute",
                        transform: "translate(-190%, -50%)",
                        cursor: "grab",
                      }}
                    >
                      <svg viewBox="0 0 20 20" width="50">
                        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            }}
            orientation="vertical"
            marks={marks}
            min={0}
            max={maxNum}
            snapDragDisabled={true}
            onChange={(value) => {
              const time = new Date(dateStartTime);
              time.setMinutes(time.getMinutes() + resolutionTime * value);
              setSliderTime(time);

              setFree(isFree(time));
            }}
            renderMark={(props) => {
              let startTime = new Date(dateStartTime);
              startTime.setMinutes(
                startTime.getMinutes() + resolutionTime * props.key
              );
              return (
                <div {...props}>
                  <div
                    style={{
                      textAlign: "right",
                      marginRight: "-30%",
                      marginTop: "-10%",
                    }}
                  >
                    {startTime.toLocaleString().substring(11, 17)}
                  </div>
                </div>
              );
            }}
          />
          <Button
            style={{
              position: "absolute",
              width: "130%",
              left: "-15%",
              marginTop: "10px",
            }}
            onClick={handleReserveCode}
            disabled={!free}
          >
            {reservations === null
              ? "No Codes"
              : maxReservations === true
              ? "Fully Booked Today"
              : "Reserve Code"}
          </Button>
        </>
      )}
    </>
  );
};
export default Slider;
