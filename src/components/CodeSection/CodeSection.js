import { database, ref } from "../../apis/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useListKeys } from "react-firebase-hooks/database";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const CodeSection = ({ emptyMessage, ...props }) => {
  const { currentUser } = useAuth();
  const CodeObject = props.codeObject;
  const [keys] = useListKeys(ref(database, `users/${currentUser.uid}/codes/`));

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
          keys.map((v) => (
            <Col key={v} className="mb-2">
              <CodeObject key={v} codeKey={v} />
            </Col>
          ))}
        {isMounted && keys?.length === 0 && <span>{emptyMessage}</span>}
      </Row>
    </Container>
  );
};

export default CodeSection;
