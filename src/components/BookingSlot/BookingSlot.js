import React from "react";

const BookingSlot = ({ time, available, onClick }) => {
  return (
    <div
      className={`booking-slot ${
        available ? "booking-slot--available" : "booking-slot--unavailable"
      }`}
      onClick={() => available && onClick(time)}
    >
      {time}
    </div>
  );
};
export default BookingSlot;
