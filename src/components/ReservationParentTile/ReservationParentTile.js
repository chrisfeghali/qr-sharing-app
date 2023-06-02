import { RemoveReservationFromUser, database, ref } from "../../apis/firebase";
import { useObjectVal } from "react-firebase-hooks/database";
import ReservationTile from "../ReservationTile/ReservationTile";
import { useEffect } from "react";

const ReservationParentTile = ({ reservationKey, ...props }) => {
  const [reservation, loading, error] = useObjectVal(
    ref(database, `reservations/${reservationKey}`)
  );

  //complains about updating the child component while the parent is updating if this isn't in a useEffect
  useEffect(() => {
    if (!error && !loading && !reservation) {
      RemoveReservationFromUser(reservationKey);
    }
  }, [error, loading, reservation, reservationKey]);

  return (
    <>
      {!error && !loading && !!reservation && (
        <>
          <ReservationTile
            reservation={reservation}
            reservationKey={reservationKey}
          />
        </>
      )}
    </>
  );
};

export default ReservationParentTile;
