import { database, ref } from "../../apis/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useListKeys } from "react-firebase-hooks/database";

import { Container, Row, Col } from "react-bootstrap";

const CodeSection = ({ ...props }) => {
  const { currentUser } = useAuth();
  const CodeObject = props.codeObject;
  const [keys, loading] = useListKeys(
    ref(database, `users/${currentUser.uid}/codes/`)
  );

  return (
    <Container style={{ width: "60%" }}>
      <Row style={{ justifyContent: "center" }}>
        {!loading &&
          !!keys &&
          keys.map((v) => (
            <Col key={v} className="mb-2">
              <CodeObject codeKey={v} />
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default CodeSection;
