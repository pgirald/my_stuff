import React, { useState } from "react";
import { Input } from "react-native-elements";
import { AppIcon } from "../Icons/AppIcon";

export const BasePasswordInput = ({
  placeholder,
  errorMessage,
  secureTextEntry = true,
  onChange = () => {},
  containerStyle={},
  style = {},
}) => {
  const [hidePassword, setHidePassWord] = useState(secureTextEntry);
  return (
    <Input
      style={style}
      containerStyle={containerStyle}
      placeholder={placeholder}
      errorMessage={errorMessage}
      onChange={onChange}
      secureTextEntry={hidePassword}
      rightIcon={
        hidePassword ? (
          <AppIcon
            name="eye-circle-outline"
            size={35}
            onPress={() => setHidePassWord(!hidePassword)}
            style={{ margin: 0 }}
          />
        ) : (
          <AppIcon
            name="eye-circle"
            size={35}
            onPress={() => setHidePassWord(!hidePassword)}
            style={{ margin: 0 }}
          />
        )
      }
    />
  );
};
