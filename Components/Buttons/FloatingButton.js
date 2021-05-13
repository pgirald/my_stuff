import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { appColors } from "../Styles/Colors";
import { AppButton } from "./AppButton";

export default function FloatingButton({
  icon,
  left,
  right,
  top,
  bottom,
  color = appColors.flamingo,
  onPress = () => {},
}) {
  return (
    <AppButton
      style={getFloatinBtnStyle(color, left, right, top, bottom)}
      icon={icon}
      onPress={onPress}
    />
  );
}

const getFloatinBtnStyle = (
  color,
  left = undefined,
  right = 10,
  top = undefined,
  bottom = 10
) => {
  return {
    position: "absolute",
    bottom: bottom,
    right: right,
    left: left,
    top: top,
    width: 50,
    height: 50,
    backgroundColor: color,
    borderRadius: 360,
  };
};
