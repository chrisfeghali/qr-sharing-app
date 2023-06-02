import "./ProfilePage.css";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import InputField from "../inputfield/InputField";
import Form from "react-bootstrap/Form";

const ProfilePage = () => {
  const {
    updateEmail,
    updatePassword,
    updateName,
    setEmail,
    setUserName,
    currentUser,
  } = useAuth();
  const isGoogleAuth =
    currentUser.providerData[0].providerId.includes("google");
  async function handleUpdateEmail(email) {
    try {
      await updateEmail(email);
      setEmail(email);
      setValue("New Email Address", "");
      setValue("Confirm New Email Address", "");
      setError("New Email Address", {
        type: "success",
        message: `Email Address changed!`,
      });
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setError(
            "New Email Address",
            {
              type: "manual",
              message: `This email address is already in use, please use another one.`,
            },
            { shouldFocus: true }
          );
          break;
        case "auth/invalid-email":
          setError(
            "New Email Address",
            {
              type: "manual",
              message: `A valid Email Address is required.`,
            },
            { shouldFocus: true }
          );
          break;
        case "auth/operation-not-allowed":
          alert("Error during email update, please contact me");
          break;
        default:
          //console.log(error.message);
          break;
      }
    }
  }
  async function handleUpdatePassword(password) {
    try {
      await updatePassword(password);
      setValue("New Password", "");
      setValue("Confirm New Password", "");
      setError("New Password", {
        type: "success",
        message: `Password changed!`,
      });
    } catch (error) {
      switch (error.code) {
        case "auth/operation-not-allowed":
          alert("Error during password update, please contact me");
          break;
        case "auth/weak-password":
          setError(
            "New Password",
            {
              type: "manual",
              message: `Password is weak, make it stronger! `,
            },
            { shouldFocus: true }
          );
          break;
        default:
          //console.log(error.message);
          break;
      }
    }
  }
  async function handleUpdateName(name) {
    try {
      await updateName(name);
      setUserName(name);
      setValue("New Name", "");
      setValue("Confirm New Name", "");
      setError("New Name", {
        type: "success",
        message: `Name changed!`,
      });
    } catch (error) {
      switch (error.code) {
        case "auth/operation-not-allowed":
          alert("Error during name update, please contact me");
          break;
        default:
          //console.log(error.message);
          break;
      }
    }
  }
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setError,
    setValue,
  } = useForm({
    mode: "onBlur", // "onChange"
  });

  const onSubmit = async (data) => {
    if (data["New Name"]) {
      await handleUpdateName(data["New Name"]);
    }
    if (data["New Email Address"]) {
      await handleUpdateEmail(data["New Email Address"]);
    }
    if (data["New Password"]) {
      await handleUpdatePassword(data["New Password"]);
    }
  };

  return (
    <>
      <div style={{ position: "absolute", top: "30px" }}>Edit Profile</div>
      <div className="Sign">
        <Form
          className="Sign-form "
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="update-form">
            <InputField
              label="New Name"
              register={register}
              type="text"
              errors={errors}
            />
            <InputField
              label="Confirm New Name"
              register={register}
              type="text"
              hide={watch("New Name", "") === "" ? true : false}
              required={watch("New Name") === "" ? false : true}
              validate={(value) =>
                value === watch("New Name") || "Names do not match."
              }
              errors={errors}
            />
          </div>
          {!isGoogleAuth && (
            <>
              <div className="update-form">
                <InputField
                  label="New Email Address"
                  register={register}
                  type="email"
                  errors={errors}
                  pattern={/^\S+@\S+$/i}
                />
                <InputField
                  label="Confirm New Email Address"
                  register={register}
                  type="text"
                  hide={watch("New Email Address", "") === "" ? true : false}
                  required={watch("New Email Address") === "" ? false : true}
                  validate={(value) =>
                    value === watch("New Email Address") ||
                    "Emails do not match."
                  }
                  errors={errors}
                />
              </div>
              <div className="update-form">
                <InputField
                  label="New Password"
                  register={register}
                  type="password"
                  errors={errors}
                  minLength="6"
                />

                <InputField
                  label="Confirm New Password"
                  register={register}
                  type="password"
                  errors={errors}
                  hide={watch("New Password", "") === "" ? true : false}
                  required={watch("New Password") === "" ? false : true}
                  validate={(value) =>
                    value === watch("New Password") || "Passwords do not match."
                  }
                />
              </div>
            </>
          )}
          <div className="Sign-password-bottom mt-2  ">
            <Button className="Sign-signin-button" type="submit">
              Update
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ProfilePage;
