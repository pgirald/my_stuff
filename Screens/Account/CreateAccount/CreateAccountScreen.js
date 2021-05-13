import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-easy-toast";
import { Avatar, Input } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppButton } from "../../../Components/Buttons/AppButton";
import { AppContainer } from "../../../Components/Containers/AppContainer";
import { AppView } from "../../../Components/Containers/AppView";
import Loading from "../../../Components/General/Loading";
import { EmailInput } from "../../../Components/Inputs/EmailInput";
import { NameInput } from "../../../Components/Inputs/NameInput";
import { PasswordConfirm } from "../../../Components/Inputs/PasswordConfirm";
import { PasswordInput } from "../../../Components/Inputs/PasswordInput";
import { PhoneInput } from "../../../Components/Inputs/PhoneInput";
import { appColors } from "../../../Components/Styles/Colors";
import {
  onAvatarPress,
  onConfirmBtnPress,
  onTextFieldChange,
} from "./CreateAccountHandlers";

export default function CreateAccountScreen() {
  const navigation = useNavigation();
  const [validateInputs, setValidateInputs] = useState(false);
  const [imageUri, setImageUri] = useState(undefined);
  const [formInputs, setFormInputs] = useState(defaultFormInputs);
  const [emailError, setEmailError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);
  const toastRef = useRef();

  const defaultConfirmProps = {
    passwordProps: {
      onChange: (e) =>
        onTextFieldChange(
          { formInputs, setFormInputs },
          "password",
          e.validatedText
        ),
    },
    confirmProps: {
      onChange: (e) =>
        onTextFieldChange(
          { formInputs, setFormInputs },
          "confirm",
          e.validatedText
        ),
    },
  };
  return (
    <AppContainer>
      <KeyboardAwareScrollView>
        <AppView>
          <Avatar
            rounded={true}
            size="xlarge"
            source={
              imageUri
                ? { uri: imageUri }
                : require("../../../assets/avatar-default.jpg")
            }
            containerStyle={styles.avatarContainer}
            onPress={() => onAvatarPress({ setImageUri })}
          />
        </AppView>
        <PhoneInput
          onChange={(e) =>
            onTextFieldChange({ formInputs, setFormInputs }, "phone", e.phone)
          }
        />
        <EmailInput
          validate={validateInputs}
          onChange={(e) => {
            onTextFieldChange(
              { formInputs, setFormInputs },
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
          placeholder="First names"
          onChange={(e) =>
            onTextFieldChange(
              { formInputs, setFormInputs },
              "firstNames",
              e.validatedText
            )
          }
        />
        <NameInput
          placeholder="Last names"
          onChange={(e) =>
            onTextFieldChange(
              { formInputs, setFormInputs },
              "lastNames",
              e.validatedText
            )
          }
        />
        <PasswordConfirm
          validate={validateInputs}
          passwordProps={defaultConfirmProps.passwordProps}
          confirmProps={defaultConfirmProps.confirmProps}
        />
        <AppButton
          title="Confirm"
          style={styles.confirmBtn}
          onPress={() =>
            onConfirmBtnPress(
              {
                setValidateInputs,
                setEmailError,
                setLoading,
                setLoadingText,
                formInputs,
                imageUri,
              },
              navigation
            )
          }
        />
      </KeyboardAwareScrollView>
      <Loading isVisible={loading} text={loadingText} />
      <Toast ref={toastRef} position="bottom" opacity={0.9} />
    </AppContainer>
  );
}

const defaultFormInputs = {
  phone: null,
  email: undefined,
  firstNames: undefined,
  lastNames: undefined,
  password: undefined,
  confirm: undefined,
};

const styles = StyleSheet.create({
  avatarContainer: { margin: 20 },
  confirmBtn: {
    backgroundColor: appColors.flamingo,
    width: "95%",
    height: "5%",
    marginTop: 10,
  },
});
