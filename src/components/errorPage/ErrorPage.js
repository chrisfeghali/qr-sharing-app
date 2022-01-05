import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";

function ErrorPage() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="d-flex flex-column justify-content-center ">
        <h1 className="text-white">Error! Page not found.</h1>
        <LinkContainer to="/home">
          <Button variant="link" className="Link fs-2">
            Go home
          </Button>
        </LinkContainer>
      </div>
    </div>
  );
}

export default ErrorPage;
