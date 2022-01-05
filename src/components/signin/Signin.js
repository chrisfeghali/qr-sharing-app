import "./Signin.css";
import { useForm } from "react-hook-form";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputField from "../inputfield/InputField";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";

function Signin(props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm({
    mode: "onBlur", // "onChange"
  });
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const userCredential = await signIn(
        data["Email Address"],
        data["Password"]
      );
      const user = userCredential.user;
      console.log(user);
      navigate("/", { replace: true });
    } catch (error) {
      switch (error.code) {
        //errors after returning from auth server, shouldn't hit any of these except for email-alrady-in-use
        case "auth/user-not-found":
          setError(
            "Email Address",
            {
              type: "manual",
              message: `This email address is not registered, please use another one.`,
            },
            { shouldFocus: true }
          );
          break;
        case "auth/operation-not-allowed":
          alert(error.message, "Error during sign in, please contact me");
          break;
        case "auth/wrong-password":
          setError(
            "Password",
            {
              type: "manual",
              message: `Password is wrong, please try again. `,
            },
            { shouldFocus: true }
          );
          break;
        default:
          console.log(error.message);
          alert(error.message, "Error during sign in, please contact me");
          break;
      }
    }
  };

  return (
    <div className="Sign">
      <div className="Sign-header">
        <span className="fs-3 mb-2">Sign In</span>
        <div className="Sign-header-links">
          <LinkContainer to="../signup">
            <Button variant="link" className="Link fs-5">
              Sign up
            </Button>
          </LinkContainer>
        </div>
      </div>
      <Form className="Sign-form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Email Address"
          register={register}
          required
          type="email"
          errors={errors}
          pattern={/^\S+@\S+$/i}
        />
        <InputField
          label="Password"
          register={register}
          required
          type="password"
          errors={errors}
        />
        <div className="Sign-password-bottom mt-2  ">
          <Button className="Sign-signin-button" type="submit">
            Sign in
          </Button>
          <LinkContainer to="../signup" className="Signin-forgot-password">
            <Button variant="link" className="Link fs-5">
              Forgot Password?
            </Button>
          </LinkContainer>
        </div>
      </Form>
      <div className="Sign-signin">
        <span className="fs-3">OR</span>
        <GoogleButton>Sign in with Google</GoogleButton>
      </div>
    </div>
  );
}

export default Signin;
