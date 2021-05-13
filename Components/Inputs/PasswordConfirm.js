import { isEmpty } from "lodash";
import React, { useState } from "react";
import { View } from "react-native";
import { BasePasswordInput } from "./BasePasswordInput";
import { PasswordInput } from "./PasswordInput";

export const PasswordConfirm = ({
  containerStyle = {},
  passwordProps = {},
  confirmProps = {},
  validate = false,
}) => {
  const [password, setPassword] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [confirmValid, setConfirmValid] = useState(null);
  const [message, setMessage] = useState(undefined);
  const [hasChanged, setHasChanged] = useState(false);
  const getErrorMessage = (password, confirm) => {
    if (isEmpty(confirm)) {
      return "You must confirm your password";
    }
    if (confirm !== password) {
      return "The input do not match with the specified password";
    }
    return undefined;
  };
  return (
    <View style={containerStyle}>
      <PasswordInput
        validate={validate}
        placeholder={passwordProps.passwordPlaceholder}
        errorMessage={passwordProps.errorMessage}
        secureTextEntry={passwordProps.secureTextEntry}
        style={passwordProps.style}
        containerStyle={passwordProps.containerStyle}
        onChange={(e, isValid) => {
          setPassword(e.nativeEvent.text);
          const auxMessage = getErrorMessage(e.nativeEvent.text, confirm);
          setMessage(auxMessage);
          passwordProps.onChange && passwordProps.onChange(e, isValid);
          if (confirmValid !== (auxMessage === undefined)) {
            setConfirmValid(auxMessage === undefined);
            confirmProps.onChange &&
              confirmProps.onChange({
                ...e,
                validatedText:
                  auxMessage === undefined ? e.nativeEvent.text : undefined,
              });
          }
        }}
      />
      <BasePasswordInput
        placeholder={confirmProps.passwordConfirm || "Confirm password"}
        errorMessage={
          validate
            ? confirmProps.errorMessage ||
              message ||
              hasChanged ||
              getErrorMessage(undefined)
            : undefined
        }
        secureTextEntry={confirmProps.secureTextEntry}
        style={confirmProps.style}
        containerStyle={confirmProps.containerStyle}
        onChange={(e) => {
          hasChanged || setHasChanged(true);
          setConfirm(e.nativeEvent.text);
          const auxMessage = getErrorMessage(password, e.nativeEvent.text);
          setMessage(auxMessage);
          setConfirmValid(auxMessage === undefined);
          confirmProps.onChange &&
            confirmProps.onChange({
              ...e,
              validatedText:
                auxMessage === undefined ? e.nativeEvent.text : undefined,
            });
        }}
      />
    </View>
  );
};
