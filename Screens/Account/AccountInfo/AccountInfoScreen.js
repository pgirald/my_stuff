import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "react-native";
import { RefreshControl } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppButton } from "../../../Components/Buttons/AppButton";
import { modalButtonStyle } from "../../../Components/Buttons/ModalButtonStyle";
import { AppContainer } from "../../../Components/Containers/AppContainer";
import { AppView } from "../../../Components/Containers/AppView";
import Modal from "../../../Components/General/Modal";
import Loading from "../../../Components/General/Loading";
import { AppIcon } from "../../../Components/Icons/AppIcon";
import { EmailInput } from "../../../Components/Inputs/EmailInput";
import { NameInput } from "../../../Components/Inputs/NameInput";
import { PasswordConfirm } from "../../../Components/Inputs/PasswordConfirm";
import { PasswordInput } from "../../../Components/Inputs/PasswordInput";
import { PhoneInput } from "../../../Components/Inputs/PhoneInput";
import { appColors } from "../../../Components/Styles/Colors";
import { getCurrentUser } from "../../../Utils/Persistence/Actions";
import {
  onAvatarPress,
  onConfirmBtnPress,
  onDiscardBtnPress,
  onOutIconPress,
  onProfileDataChange,
  onUpdateBtnPress,
} from "./AccountInfoHandlers";

export default function AccountInfoScreen() {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AppIcon
          name="account-arrow-right"
          size={50}
          onPress={() => onOutIconPress(undefined, navigation)}
        />
      ),
    });
  }, []);

  const defaultProfileData = useRef(getDefaultProfileData());

  const navigation = useNavigation();
  const [validateEmail, setValidateEmail] = useState(false);
  const [profileData, setProfileData] = useState(defaultProfileData.current);
  const [emailError, setEmailError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);
  const [nothingChanged, setNothingChanged] = useState(true);
  const [key, setKey] = useState(true);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const modalRef = useRef();
  return (
    <AppContainer>
      <KeyboardAwareScrollView>
        <Avatar
          rounded={true}
          size="xlarge"
          source={
            profileData.imageUri
              ? { uri: profileData.imageUri }
              : require("../../../assets/avatar-default.jpg")
          }
          containerStyle={styles.avatarCotainer}
          onPress={() =>
            onAvatarPress({
              setProfileData,
              profileData,
              setNothingChanged,
              nothingChanged,
              setAvatarChanged,
            })
          }
        />
        <AppView key={key} style={{ alignSelf: "auto" }}>
          <PhoneInput
            defaultValue={defaultProfileData.current.phone}
            onChange={(e) =>
              onProfileDataChange(
                {
                  profileData,
                  setProfileData,
                  setNothingChanged,
                  nothingChanged,
                },
                "phone",
                e.phone
              )
            }
          />
          <EmailInput
            defaultValue={defaultProfileData.current.email}
            validate={validateEmail}
            onChange={(e) => {
              onProfileDataChange(
                {
                  profileData,
                  setProfileData,
                  setNothingChanged,
                  nothingChanged,
                },
                "email",
                e.validatedText
              );
              if (emailError) {
                setEmailError(undefined);
              }
            }}
            errorMessage={emailError}
          />
          <NameInput
            defaultValue={defaultProfileData.current.firstNames}
            placeholder="First names"
            onChange={(e) =>
              onProfileDataChange(
                {
                  profileData,
                  setProfileData,
                  setNothingChanged,
                  nothingChanged,
                },
                "firstNames",
                e.validatedText
              )
            }
          />
          <NameInput
            defaultValue={defaultProfileData.current.lastNames}
            placeholder="Last names"
            onChange={(e) =>
              onProfileDataChange(
                {
                  profileData,
                  setProfileData,
                  setNothingChanged,
                  nothingChanged,
                },
                "lastNames",
                e.validatedText
              )
            }
          />
        </AppView>
        <AppView style={{ flexDirection: "row" }}>
          <AppButton
            title="Discard changes"
            style={styles.discardBtn}
            disabled={nothingChanged}
            onPress={() =>
              onDiscardBtnPress(
                {
                  setNothingChanged,
                  setProfileData,
                  key,
                  setKey,
                  setAvatarChanged,
                },
                defaultProfileData.current
              )
            }
          />
          <AppButton
            title="Update profile"
            style={styles.updateBtn}
            disabled={nothingChanged}
            onPress={() =>
              onUpdateBtnPress({ profileData, setValidateEmail }, modalRef)
            }
          />
        </AppView>
      </KeyboardAwareScrollView>
      <UpdateModal
        modalRef={modalRef}
        navigation={navigation}
        args={{
          profileData,
          setLoading,
          setLoadingText,
          setEmailError,
          avatarChanged,
          setValidateEmail,
        }}
        defaultProfileData={defaultProfileData}
      />
      <Loading isVisible={loading} text={loadingText} />
    </AppContainer>
  );
}

function UpdateModal({ modalRef, navigation, args, defaultProfileData }) {
  const [validateConfirm, setValidateConfirm] = useState(false);
  const [password, setPassword] = useState(undefined);
  const [passwordProps, setPasswordProps] = useState({
    onChange: (e) => setPassword(e.validatedText),
    errorMessage: undefined,
  });
  const [confirm, setConfirm] = useState(undefined);
  const [confirmProps, setConfirmProps] = useState({
    onChange: (e) => setConfirm(e.validatedText),
    errorMessage: undefined,
  });
  return (
    <Modal modalRef={modalRef}>
      <PasswordConfirm
        containerStyle={{ marginVertical: 15 }}
        passwordProps={passwordProps}
        confirmProps={confirmProps}
        validate={validateConfirm}
      />
      <AppButton
        title="Confirm"
        style={modalButtonStyle()}
        onPress={() =>
          onConfirmBtnPress(
            {
              ...args,
              password,
              confirm,
              confirmProps,
              setConfirmProps,
              passwordProps,
              setPasswordProps,
              setValidateConfirm,
            },
            navigation,
            modalRef,
            defaultProfileData
          )
        }
      />
    </Modal>
  );
}

const getDefaultProfileData = () => {
  const user = getCurrentUser();
  const namesRegex = /^([A-Za-z ]+)@([A-Za-z ]+)$/;
  const names = user.displayName && user.displayName.match(namesRegex);
  const phoneRegex = /^\+([0-9])+ ([0-9])+$/;
  const phone = user.phoneNumber && user.phoneNumber.match(phoneRegex);
  return {
    phone: { callingCode: phone && phone[1], number: phone && phone[2] },
    email: user.email,
    firstNames: names && names[1],
    lastNames: names && names[2],
    imageUri: user.photoURL,
  };
};

const styles = StyleSheet.create({
  avatarCotainer: { alignSelf: "center", marginVertical: 20 },
  discardBtn: {
    margin: 20,
    width: "35%",
    height: "6%",
    backgroundColor: appColors.aquamarineBlue,
  },
  updateBtn: {
    margin: 20,
    width: "35%",
    height: "6%",
    alignSelf: "center",
    backgroundColor: appColors.flamingo,
  },
});
