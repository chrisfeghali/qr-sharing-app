import { useForm } from "react-hook-form";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputField from "../inputfield/InputField";
import { useAuth } from "../../contexts/AuthContext";

function ResetPassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const { resetPassword } = useAuth();

  const onSubmit = async (data) => {
    try {
      await resetPassword(data["Email Address"]);
      setError(
        "Email Address",
        {
          type: "success",
          message: `A reset password email has been sent! It might be in your junk 👀`,
        },
        { shouldFocus: true }
      );
    } catch (error) {
      switch (error.code) {
        //errors after returning from auth server, show errors
        case "auth/operation-not-allowed":
          alert("Error during sign up, please contact me");
          break;
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
        case "auth/invalid-email":
          setError(
            "Email Address",
            {
              type: "manual",
              message: `This email address is not valid, please use another one.`,
            },
            { shouldFocus: true }
          );
          break;
        default:
          //console.log(error.message);
          break;
      }
    }
  };

  return (
    <div className="Sign">
      <div className="Sign-header">
        <span className="fs-3 mb-2">Reset Password</span>
        <div></div>
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
        <div className="Sign-password-bottom mt-2  ">
          <Button className="Sign-signin-button" type="submit">
            Submit
          </Button>
          <LinkContainer to="../signin" className="Signin-forgot-password">
            <Button variant="link" className="Link fs-5">
              Sign in
            </Button>
          </LinkContainer>
        </div>
      </Form>
    </div>
  );
}

export default ResetPassword;
