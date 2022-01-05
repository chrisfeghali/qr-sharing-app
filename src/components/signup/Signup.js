import "./Signup.css";
import { useForm } from "react-hook-form";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputField from "../inputfield/InputField";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setError,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const userCredential = await signUp(
        data["Email Address"],
        data["Password"]
      );
      const user = userCredential.user;
      console.log(user);
      //TODO error handling for this
      await updateProfile(user, { displayName: data["Name"] });

      navigate("/", { replace: true });
    } catch (error) {
      switch (error.code) {
        //errors after returning from auth server, shouldn't hit any of these except for email-alrady-in-use
        case "auth/email-already-in-use":
          setError(
            "Email Address",
            {
              type: "manual",
              message: `This email address is already in use, please use another one.`,
            },
            { shouldFocus: true }
          );
          break;
        case "auth/invalid-email":
          setError(
            "Email Address",
            {
              type: "manual",
              message: `A valid Email Address is required.`,
            },
            { shouldFocus: true }
          );
          break;
        case "auth/operation-not-allowed":
          alert("Error during sign up, please contact me");
          break;
        case "auth/weak-password":
          setError(
            "Password",
            {
              type: "manual",
              message: `Password is weak, make it stronger! `,
            },
            { shouldFocus: true }
          );
          break;
        default:
          console.log(error.message);
          break;
      }
    }
  };

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
      <Form className="Sign-form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Name"
          register={register}
          required
          type="text"
          errors={errors}
        />
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
          minLength="6"
        />
        <InputField
          label="Confirm Password"
          register={register}
          required
          type="password"
          errors={errors}
          validate={(value) =>
            value === watch("Password") || "Passwords do not match."
          }
        />
        <Button className="Sign-signin-button" type="submit">
          Sign up
        </Button>
      </Form>
    </div>
  );
}

export default Signup;
