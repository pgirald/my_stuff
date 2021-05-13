import React from "react";
import { StyleSheet } from "react-native";
import { Button, Image } from "react-native-elements";
import { AppView } from "../Containers/AppView";
import { styleMapper } from "../Containers/AppViewStyleMapper";
import { AppIcon } from "../Icons/AppIcon";
import { appDefaultStyle } from "../Styles/AppDefaultStyle";
import { appColors } from "../Styles/Colors";

export const AppButton = ({
  title,
  onPress,
  icon,
  disabled = false,
  style = {},
  args = {},
}) => {
  return (
    <AppView
      args={args}
      style={{
        ...styleMapper(style),
      }}
    >
      <Button
        disabled={disabled}
        icon={icon}
        buttonStyle={{
          ...style,
          ...appDefaultStyle(),
        }}
        title={title}
        onPress={onPress}
      />
    </AppView>
  );
};
