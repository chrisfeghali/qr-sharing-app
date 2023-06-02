import "./Signin.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import InputField from "../inputfield/InputField";
import { useAuth } from "../../contexts/AuthContext";
import GoogleButton from "react-google-button";
import { CreateUserInDatabase } from "../../apis/firebase";
import { getAdditionalUserInfo } from "firebase/auth";

function Signin(props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm({
    mode: "onBlur", // "onChange"
  });
  const { signIn, signInPopup } = useAuth();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const onSubmit = async (data) => {
    try {
      await signIn(data["Email Address"], data["Password"]);
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
          //console.log(error.message);
          alert(error.message, "Error during sign in, please contact me");
          break;
      }
    }
  };

  const googleSignIn = async () => {
    try {
      const signInResult = await signInPopup();
      const userAdditionalInfo = getAdditionalUserInfo(signInResult);
      if (userAdditionalInfo.isNewUser) {
        try {
          await CreateUserInDatabase(
            signInResult.user.uid,
            signInResult.user.displayName,
            signInResult.user.email
          );
        } catch (error) {
          //console.log(error);
        }
      }
    } catch (error) {
      switch (error.code) {
        case "auth/account-exists-with-different-credential":
          setErrorMessage(
            "An account already exists with this email, contact me because this isn't supposed to happen"
          );
          break;
        case "auth/auth-domain-config-required":
          setErrorMessage(
            "Auth domain config not provided. I don't know what that means either, but contact me because this isn't supposed to happen"
          );
          break;
        case "auth/cancelled-popup-request":
          setErrorMessage(
            "Only one popup request is allowed at a time, maybe stop pressing the button?"
          );
          break;
        case "auth/operation-not-allowed":
          setErrorMessage("Your account isn't enabled, contact me");
          break;
        case "auth/operation-not-supported-in-this-environment":
          setErrorMessage("Your environment is supported, where are you??");
          break;
        case "auth/popup-blocked":
          setErrorMessage(
            "The popup was blocked, would you mind enabling them?"
          );
          break;
        case "auth/popup-closed-by-user":
          setErrorMessage("You closed the popup before signing in, ya dingus");
          break;
        case "auth/unauthorized-domain":
          setErrorMessage(
            "The app domain isn't authorised for OAuth, contact me because this isn't supposed to happen"
          );
          break;
        default:
          setErrorMessage(error.code);
      }
      setShowError(true);
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
          <LinkContainer
            to="../resetpassword"
            className="Signin-forgot-password"
          >
            <Button variant="link" className="Link fs-5">
              Forgot Password?
            </Button>
          </LinkContainer>
        </div>
      </Form>
      <div className="Sign-signin position-relative">
        <span className="fs-3">OR</span>
        <GoogleButton onClick={googleSignIn}>Sign in with Google</GoogleButton>
        <Alert
          className="position-absolute top-25"
          variant="danger"
          show={showError}
          style={{ zIndex: 1 }}
          onClose={() => {
            setShowError(false);
          }}
          dismissible
        >
          <Alert.Heading>{errorMessage}</Alert.Heading>
        </Alert>
      </div>
    </div>
  );
}

export default Signin;
