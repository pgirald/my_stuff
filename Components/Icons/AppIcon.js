import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Image } from "react-native-elements";
import { getHeightRelativeToWindow } from "../../Utils/General/WindowDimensions";
import { appColors } from "../Styles/Colors";

export const AppIcon = ({
  name,
  size,
  onPress,
  rotatationDegree,
  color = appColors.pearlBush,
  type = "material-community",
  containerStyle = {},
}) => {
  return (
    <View style={containerStyle}>
      <Icon
        type={type}
        name={name}
        size={getHeightRelativeToWindow(size)}
        color={color}
        onPress={onPress}
        style={
          rotatationDegree && {
            transform: [{ rotate: rotatationDegree + "deg" }],
          }
        }
      />
    </View>
  );
};
