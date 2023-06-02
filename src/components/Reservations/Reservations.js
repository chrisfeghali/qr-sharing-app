import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useAuth } from "../../contexts/AuthContext";
import { useListKeys } from "react-firebase-hooks/database";
import { ref, database, query } from "../../apis/firebase";
import { useEffect, useState } from "react";
import ReservationParentTile from "../ReservationParentTile/ReservationParentTile";
import { orderByValue } from "firebase/database";

const Reservations = () => {
  const { currentUser } = useAuth();

  const dbQuery = query(
    ref(database, `users/${currentUser.uid}/reservations/`),
    orderByValue()
  );

  const [keys] = useListKeys(dbQuery);

  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, [setIsMounted]);

  return (
    <Container>
      <Row style={{ justifyContent: "center" }}>
        {isMounted &&
          !!keys &&
          (keys.length
            ? keys.map((v) => (
                <Col key={v} className="mb-2">
                  <ReservationParentTile reservationKey={v} key={v} />
                </Col>
              ))
            : "No reservations")}
      </Row>
    </Container>
  );
};

export default Reservations;
