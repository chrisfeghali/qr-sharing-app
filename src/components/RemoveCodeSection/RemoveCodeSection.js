import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const RemoveCodeSection = ({ codeKeys, ...props }) => {
  const CodeObject = props.codeObject;

  return (
    <Container>
      <Row style={{ justifyContent: "center" }}>
        {codeKeys.map((v) => (
          <Col key={v} className="mb-2">
            <CodeObject key={v} codeKey={v} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RemoveCodeSection;
