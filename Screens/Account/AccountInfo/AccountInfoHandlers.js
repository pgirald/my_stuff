import { isEmpty } from "lodash";
import { Alert } from "react-native";
import { PasswordConfirm } from "../../../Components/Inputs/PasswordConfirm";
import { loadImageFromGallery } from "../../../Utils/General/FilesManagement";
import {
  closeSession,
  getCurrentUser,
  reAuthenticate,
  updateEmail,
  updateProfile,
  uploadFile,
} from "../../../Utils/Persistence/Actions";

export async function onAvatarPress(args) {
  const result = await loadImageFromGallery([1, 1]);
  if (result.successful) {
    onProfileDataChange(args, "imageUri", result.uri);
    args.setAvatarChanged(true);
  }
}

export function onProfileDataChange(args, inputName, value) {
  args.setProfileData({ ...args.profileData, [inputName]: value });
  if (args.nothingChanged) {
    args.setNothingChanged(false);
  }
}

export function onDiscardBtnPress(args, defaultprofileData) {
  args.setProfileData(defaultprofileData);
  args.setNothingChanged(true);
  args.setKey(!args.key);
  args.setAvatarChanged(false);
}

export async function onUpdateBtnPress(args, modalRef) {
  args.setValidateEmail(true);
  if (isEmpty(args.profileData.email)) {
  } else {
    modalRef.current.show(true);
  }
}

export function onOutIconPress(args, navigation) {
  closeSession();
  navigation.goBack();
}

export async function onConfirmBtnPress(
  args,
  navigation,
  modalRef,
  defaultprofileData
) {
  if (isEmpty(args.password) || isEmpty(args.confirm)) {
    args.setValidateConfirm(true);
    return;
  }
  args.setLoadingText("Reauthenticating");
  args.setLoading(true);
  let result = await reAuthenticate(args.password);
  if (!result.successful) {
    args.setLoading(false);
    Alert.alert(
      "Error",
      "The password is invalid or the user does not have a password"
    );
    return;
  }
  if (emailChanged(defaultprofileData.current.email, args.profileData.email)) {
    args.setLoadingText("Updating email");
    result = await updateEmail(args.profileData.email);
    if (!result.successful) {
      args.setLoading(false);
      args.setValidateEmail(true);
      args.setEmailError(
        "The email address is already in use by another account"
      );
      modalRef.current.show(false);
      return;
    }
  }

  const profileData = {
    displayName:
      isEmpty(args.profileData.firstNames) ||
      isEmpty(args.profileData.lastNames)
        ? undefined
        : args.profileData.firstNames + "@" + args.profileData.lastNames,
  };

  args.profileData.phone &&
    (profileData.displayName +=
      "+" +
      args.profileData.phone.callingCode +
      " " +
      args.profileData.phone.number +
      " " +
      args.profileData.phone.countryCode);

  if (args.avatarChanged) {
    args.setLoadingText("Updating profile photo");
    result = await uploadFile(
      args.profileData.imageUri,
      "avatars",
      getCurrentUser().uid
    );
    if (result.successful) {
      profileData.photoURL = result.url;
    } else {
      args.setLoading(false);
      Alert.alert("The profile photo did not changed");
      return;
    }
  }
  if (profileDataChanged(defaultprofileData.current, profileData)) {
    args.setLoadingText("Updating profile data");
    result = await updateProfile(profileData);
    if (!result.successful) {
      args.setLoading(false);
      Alert.alert("Error", "Error while updating profile data");
      return;
    }
  }
  args.setLoading(false);
  Alert.alert("Nice!", "Your profile data was updated");
  modalRef.current.show(false);
  navigation.goBack();
}

function profileDataChanged(previus, current) {
  return (
    previus.firstNames +
      "@" +
      previus.lastNames +
      "+" +
      previus.phone.callingCode +
      " " +
      previus.phone.number +
      " " +
      previus.phone.countryCode !==
    current.displayName
  );
}

function emailChanged(previus, current) {
  return previus !== current;
}
