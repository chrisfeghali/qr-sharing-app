import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import InputField from "../inputfield/InputField";
import Form from "react-bootstrap/Form";
import { useGroup } from "../../contexts/GroupContext";

const EditGroupPage = () => {
  const { groupName, updateGroupName, setGroupName } = useGroup();

  async function handleUpdateGroupName(name) {
    try {
      await updateGroupName(name);
      setGroupName(name);
      setValue("New Name", "");
      setValue("Confirm New Name", "");
      setError("New Name", {
        type: "success",
        message: `Name changed!`,
      });
    } catch (error) {
      console.log(error.message);
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
      <div className="Sign w-50">
        <div className="Sign-header">
          <span className="fs-3 mb-2">Edit Group - {groupName}</span>
        </div>
        <Form
          className="Sign-form "
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <InputField
              label="New Name"
              register={register}
              type="text"
              errors={errors}
              className=" w-50"
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
              className=" w-50"
            />
          </div>

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

export default EditGroupPage;
