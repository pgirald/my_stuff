import { isEmpty, size } from "lodash";
import React, { useState } from "react";
import { BasePasswordInput } from "./BasePasswordInput";

export const PasswordInput = ({
  errorMessage,
  placeholder = "Password",
  secureTextEntry = true,
  onChange = () => {},
  style = {},
  containerStyle={},
  validate = false,
}) => {
  const [message, setMessage] = useState(undefined);
  const [hasChanged, setHasChanged] = useState(false);
  const getErrorMessage = (password) => {
    if (isEmpty(password)) {
      return "You must specify a password";
    }
    if (size(password) < 6) {
      return "Your password must have at least 6 characters";
    }
    return undefined;
  };
  return (
    <BasePasswordInput
      style={style}
      containerStyle={containerStyle}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      errorMessage={
        validate
          ? errorMessage || message || hasChanged || getErrorMessage(undefined)
          : undefined
      }
      onChange={(e) => {
        hasChanged || setHasChanged(true);
        const auxMessage = getErrorMessage(e.nativeEvent.text);
        setMessage(auxMessage);
        onChange({ ...e,
            validatedText:
              auxMessage === undefined ? e.nativeEvent.text : undefined, });
      }}
    />
  );
};
