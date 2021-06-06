import { isEmpty } from "lodash";
import { Alert } from "react-native";
import {
  getCurrentUser,
  loginWithEmailAndPassword,
  recoverPassword,
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

export const onForgotPasswordLabelPress = (modalRef) => {
  modalRef.current.show(true);
};

export const onRecorverBtnPress = async (
  { setLoading, recoverEmail, setValidateRecoverEmail },
  modalRef
) => {
  if (isEmpty(recoverEmail)) {
    setValidateRecoverEmail(true);
    return;
  }
  setLoading(true);
  const result = await recoverPassword(recoverEmail);
  setLoading(false);
  if (result.successful) {
    modalRef.current.show(false);
    Alert.alert("Nice!", "A mail has been sent to the specified email");
  } else {
    Alert.alert("Error", "There was an error in the process");
  }
};
