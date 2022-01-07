import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const InputField = ({
  label,
  register,
  required,
  type,
  errors,
  maxLength = 50,
  minLength = 0,
  pattern,
  validate,
}) => (
  <>
    <FloatingLabel
      controlId={label}
      label={required === true ? `${label}*` : label}
      className="mb-3"
    >
      <Form.Control
        {...register(label, {
          maxLength: {
            value: maxLength,
            message: `Maximum length is ${maxLength}`,
          },
          minLength: {
            value: minLength,
            message: `Minimum length is ${minLength}`,
          },
          required: `${label} is required`,
          pattern: {
            value: pattern,
            message: `A valid ${label} is required`,
          },
          validate: validate,
        })}
        type={type}
        placeholder={label}
        isInvalid={errors[label] && errors[label].type !== "success"}
        isValid={errors[label] && errors[label].type === "success"}
      />
      <Form.Control.Feedback type="invalid" className="Sign-feedback-text mt-1">
        {errors[label]?.type !== "success" ? errors[label]?.message : ""}
      </Form.Control.Feedback>
      <Form.Control.Feedback type="valid" className="Sign-feedback-text mt-1">
        {errors[label]?.type === "success" ? errors[label]?.message : ""}
      </Form.Control.Feedback>
    </FloatingLabel>
  </>
);

export default InputField;
