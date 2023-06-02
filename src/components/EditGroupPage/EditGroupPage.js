import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import InputField from "../inputfield/InputField";
import Form from "react-bootstrap/Form";
import { useGroup } from "../../contexts/GroupContext";
import { DeleteGroup } from "../../apis/firebase";
import { useNavigate, useParams } from "react-router-dom";

const EditGroupPage = () => {
  const { updateGroupName } = useGroup();
  const params = useParams();
  const navigate = useNavigate();

  async function handleUpdateGroupName(name) {
    try {
      await updateGroupName(name);
      setValue("New Name", "");
      setValue("Confirm New Name", "");
      setError("New Name", {
        type: "success",
        message: `Name changed!`,
      });
    } catch (error) {
      //console.log(error.message);
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
      await handleUpdateGroupName(data["New Name"]);
    }
  };

  return (
    <>
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

          <div className="Sign-password-bottom mt-2  ">
            <Button className="Sign-signin-button" type="submit">
              Update
            </Button>
          </div>
          <div className="Sign-password-bottom mt-4  ">
            <Button
              className="Sign-signin-button"
              onClick={async () => {
                try {
                  await DeleteGroup(params.groupID);
                  navigate("/home/homepage", { replace: true });
                } catch (error) {
                  //console.log(error);
                }
              }}
            >
              Remove Group
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default EditGroupPage;
