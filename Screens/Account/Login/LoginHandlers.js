import { isEmpty } from "lodash";
import { Alert } from "react-native";
import {
  getCurrentUser,
  loginWithEmailAndPassword,
} from "../../../Utils/Persistence/Actions";

export const onLoginButtonPress = async (args, onUserLogged) => {
  args.setValidateInputs(true);
  if (Object.values(args.formInputs).some((field) => isEmpty(field))) {
    return;
  }
  args.setLoading(true);
  const result = await loginWithEmailAndPassword(
    args.formInputs.email,
    args.formInputs.password
  );
  args.setLoading(false);
  if (!result.successful) {
    args.setErrors({
      email: "Invalid user or password",
      password: "Invalid user or password",
    });
    console.log(result.error);
  } else {
    onUserLogged();
  }
};

export const onTextFieldChange = (args, inputName, value, defaultErrors) => {
  args.setFormInputs({ ...args.formInputs, [inputName]: value });
  if (Object.values(args.errors).some((error) => !isEmpty(error))) {
    args.setErrors(defaultErrors);
  }
};
