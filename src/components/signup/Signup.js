import "./Signup.css";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

function Signup() {
  return (
    <div className="Sign">
      <div className="Sign-header">
        <span className="fs-3 mb-2">Sign Up</span>
        <div className="Sign-header-links">
          <LinkContainer to="../signin">
            <Button variant="link" className="Sign-link fs-5">
              Sign in
            </Button>
          </LinkContainer>
        </div>
      </div>
      <Form className="Sign-form">
        <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
          <Form.Control type="email" placeholder="name@example.com" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Email address"
          className="mb-3"
        >
          <Form.Control type="email" placeholder="name@example.com" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingPassword"
          label="Password"
          className="mb-3 Sign-password"
        >
          <Form.Control type="password" placeholder="Password" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingPassword"
          label="Retype Password"
          className="mb-3 Sign-password"
        >
          <Form.Control type="password" placeholder="Password" />
          <div className="Sign-password-bottom mt-2  ">
            <Button className="Sign-signin-button" type="submit">
              Sign up
            </Button>
          </div>
        </FloatingLabel>
      </Form>
    </div>
  );
}

export default Signup;
