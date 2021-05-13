import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { Dimensions } from "react-native";
import { Logo } from "../../../Components/Icons/Logo";
import { appColors } from "../../../Components/Styles/Colors";
import { AppButton } from "../../../Components/Buttons/AppButton";
import { AppImage } from "../../../Components/Icons/AppImage";
import { AppContainer } from "../../../Components/Containers/AppContainer";
import { PasswordInput } from "../../../Components/Inputs/PasswordInput";
import { IconsContainer } from "../../../Components/Icons/IconsContainer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { EmailInput } from "../../../Components/Inputs/EmailInput";
import { isEmpty } from "lodash";
import { onLoginButtonPress, onTextFieldChange } from "./LoginHandlers";
import Loading from "../../../Components/General/Loading";

export default function LoginScreen({ onUserLogged = () => {} }) {
  const navigation = useNavigation();
  const [validateInputs, setValidateInputs] = useState(false);
  const [formInputs, setFormInputs] = useState(defaultInputs);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(defaultErrors);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <AppContainer>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.keyboardAwareContainerContent}
      >
        <Logo
          source={require("../../../assets/logo.png")}
          style={styles.logo}
        />
        <EmailInput
          style={styles.input}
          validate={validateInputs}
          onChange={(e) =>
            onTextFieldChange(
              { formInputs, setFormInputs, errors, setErrors },
              "email",
              e.validatedText,
              defaultErrors
            )
          }
          errorMessage={errors.email}
        />
        <PasswordInput
          style={styles.input}
          validate={validateInputs}
          onChange={(e) =>
            onTextFieldChange(
              { formInputs, setFormInputs, errors, setErrors },
              "password",
              e.validatedText,
              defaultErrors
            )
          }
          errorMessage={errors.password}
        />
        <AppButton
          style={styles.loginBtn}
          title="Login"
          onPress={() =>
            onLoginButtonPress(
              { formInputs, setLoading, setValidateInputs, setErrors },
              onUserLogged
            )
          }
        />
        <Text style={styles.text}>Forgot password?</Text>
        <IconsContainer
          style={styles.iconsContainer}
          iconsProps={iconsProperties}
        />
        <AppImage
          source={require("../../../assets/timeline.png")}
          resizeMode="stretch"
          style={styles.timeline}
        />
        <AppButton
          style={styles.createAccountBtn}
          title="Create account"
          onPress={() => navigation.navigate("CreateAccount")}
        />
        <StatusBar style="auto" />
      </KeyboardAwareScrollView>
      <Loading isVisible={loading} />
    </AppContainer>
  );
}

const defaultInputs = {
  email: undefined,
  password: undefined,
};

const defaultErrors = {
  email: undefined,
  password: undefined,
};

const iconsProperties = [
  {
    source: require("../../../assets/google.png"),
  },
  {
    source: require("../../../assets/facebook.png"),
  },
];

const styles = StyleSheet.create({
  keyboardAwareContainerContent: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  logo: {
    height: "27%",
    width: "100%",
    marginVertical: 20,
  },
  timeline: {
    height: "5%",
    width: "95%",
    margin: 15,
  },
  createAccountBtn: {
    width: "50%",
    height: "5%",
    backgroundColor: appColors.aquamarineBlue,
    margin: 35,
  },
  loginBtn: {
    backgroundColor: appColors.flamingo,
    width: "95%",
    height: "5%",
    margin: 5,
    marginTop: 15,
  },
  text: {
    color: appColors.robbinsEggBlue,
    alignSelf: "center",
    marginTop: 5,
    fontSize: 0.036 * Dimensions.get("window").width,
  },
  iconsContainer: {
    height: "4%",
    width: "50%",
    marginTop: 5,
    marginBottom: 20,
  },
  input: {
    margin: 5,
  },
});
