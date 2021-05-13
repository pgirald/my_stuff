import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Icon, Image, Input } from "react-native-elements";
import {
  isEmailValid,
  isNameValid,
} from "../../Utils/General/InputValidations";

export const NameInput = ({
  rightIcon,
  errorMessage,
  defaultValue,
  placeholder = "Name",
  onChange = () => {},
  style = {},
  validate = false,
}) => {
  const [name, setName] = useState(defaultValue || "");
  return (
    <Input
      value={name}
      style={style}
      placeholder={placeholder}
      errorMessage={
        validate
          ? errorMessage || (isEmpty(name) && "You must specify name")
          : undefined
      }
      onChange={(e) => {
        let auxName = name;
        if (isNameValid(e.nativeEvent.text)) {
          setName(e.nativeEvent.text);
          auxName = e.nativeEvent.text;
        }
        onChange({
          ...e,
          validatedText: isEmpty(auxName) ? undefined : auxName,
        });
      }}
      rightIcon={rightIcon}
    />
  );
};
