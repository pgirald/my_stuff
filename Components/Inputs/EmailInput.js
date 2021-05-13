import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Icon, Image, Input } from "react-native-elements";
import { isEmailValid } from "../../Utils/General/InputValidations";

export const EmailInput = ({
  rightIcon,
  errorMessage,
  defaultValue,
  placeholder = "Email",
  onChange = () => {},
  style = {},
  validate = false,
}) => {
  const [message, setMessage] = useState(undefined);
  const [hasChanged, setHasChanged] = useState(defaultValue ? true : false);
  const getErrorMessage = (text) => {
    if (!isEmailValid(text) || isEmpty(text)) {
      return "You must specify a valid email";
    }
    return undefined;
  };
  return (
    <Input
      defaultValue={defaultValue}
      style={style}
      placeholder={placeholder}
      errorMessage={
        validate
          ? errorMessage || message || hasChanged || getErrorMessage(undefined)
          : undefined
      }
      onChange={(e) => {
        hasChanged || setHasChanged(true);
        const auxMessage = getErrorMessage(e.nativeEvent.text);
        setMessage(auxMessage);
        onChange({
          ...e,
          validatedText:
            auxMessage === undefined ? e.nativeEvent.text : undefined,
        });
      }}
      keyboardType="email-address"
      rightIcon={rightIcon}
    />
  );
};
