import "./Signin.css";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import GoogleButton from "react-google-button";

function Signin(props) {
  return (
    <div className="Sign">
      <div className="Sign-header">
        <span className="fs-3 mb-2">Sign In</span>
        <div className="Sign-header-links">
          <LinkContainer to="../signup">
            <Button variant="link" className="Sign-link fs-5">
              Sign up
            </Button>
          </LinkContainer>
        </div>
      </div>
      <Form className="Sign-form">
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
          <div className="Sign-password-bottom mt-2  ">
            <Button className="Sign-signin-button" type="submit">
              Sign in
            </Button>
            <LinkContainer to="../signup" className="Signin-forgot-password">
              <Button variant="link" className="Sign-link fs-5">
                Forgot Password?
              </Button>
            </LinkContainer>
          </div>
        </FloatingLabel>
      </Form>
      <div className="Sign-signin">
        <span className="fs-3">OR</span>
        <GoogleButton>Sign in with Google</GoogleButton>
      </div>
    </div>
  );
}

export default Signin;
