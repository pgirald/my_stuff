import { VideoExportPreset } from "expo-image-picker";
import { isEmpty } from "lodash";
import { Alert } from "react-native";
import { loadImageFromGallery } from "../../../Utils/General/FilesManagement";
import {
  getCurrentUser,
  registerUser,
  updateProfile,
  uploadFile,
} from "../../../Utils/Persistence/Actions";

export async function onAvatarPress(args) {
  const result = await loadImageFromGallery([1, 1]);
  if (result.successful) {
    args.setImageUri(result.uri);
  }
}

export async function onConfirmBtnPress(args, navigation) {
  args.setValidateInputs(true);
  if (
    isEmpty(args.formInputs.email) ||
    isEmpty(args.formInputs.password) ||
    isEmpty(args.formInputs.confirm)
  ) {
    return;
  }
  args.setLoadingText("Registering user");
  args.setLoading(true);
  let result = await registerUser(
    args.formInputs.email,
    args.formInputs.password
  );
  if (!result.successful) {
    args.setEmailError(result.error);
    args.setLoading(false);
    return;
  }
  if (!isEmpty(args.imageUri)) {
    args.setLoadingText("Uploading profile photo");
    result = await uploadFile(args.imageUri, "avatars", getCurrentUser().uid);
    if (!result.successful) {
      args.setLoading(false);
      Alert.alert(result.error);
      return;
    }
  }
  const data = {
    phoneNumber:
      args.formInputs.phone &&
      "+" +
        args.formInputs.phone.callingCode +
        " " +
        args.formInputs.phone.number,
    photoURL: result.url,
    displayName:
      isEmpty(args.formInputs.firstNames) || isEmpty(args.formInputs.lastNames)
        ? undefined
        : args.formInputs.firstNames + "@" + args.formInputs.lastNames,
  };
  if (Object.values(data).some((field) => !isEmpty(field))) {
    args.setLoadingText("Uploading additional data");
    result = await updateProfile(data);
    if (!result.successful) {
      args.setLoading(false);
      Alert.alert(result.error);
      return;
    }
  }
  args.setLoading(false);
  Alert.alert("Nice!", "Process successfully done", ["OK"]);
  navigation.goBack();
}

export function onTextFieldChange(args, inputName, value) {
  args.setFormInputs({ ...args.formInputs, [inputName]: value });
}
