import { sortedIndex } from "lodash";
import React from "react";
import { Dimensions } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "react-native-elements";
import { getHeightRelativeToWindow } from "../../Utils/General/WindowDimensions";
import { AppView } from "../Containers/AppView";
import { styleMapper } from "../Containers/AppViewStyleMapper";
import { appDefaultStyle } from "../Styles/AppDefaultStyle";
import { AppImage } from "./AppImage";

export const IconsContainer = ({
  iconsProps,
  style = {},
  iconsDistance = 0, //Functionality broken :(
  args = {},
}) => {
  return (
    <AppView
      //args={{ ...args, heightRelativeToWindow: false }}
      args={args}
      style={{
        ...style,
        flexDirection: style.flexDirection || "row",
      }}
    >
      <AppView
        args={{ heightRelativeToWindow: false }}
        style={{ height: "100%", width: 100 / iconsProps.length + "%" }}
        key={iconsProps[0].key || 0}
      >
        <IconContainer iconProps={iconsProps[0]} />
      </AppView>
      {iconsProps.slice(1).map((iconProps, i) => (
        <AppView
          args={{ heightRelativeToWindow: false }}
          key={iconProps.key || i}
          style={{
            height: "100%",
            width: 100 / iconsProps.length + "%",
            //marginLeft: iconsDistance,
          }}
        >
          <IconContainer iconProps={iconProps} />
        </AppView>
      ))}
    </AppView>
  );
};

const IconContainer = ({ iconProps }) => {
  iconProps.style = iconProps.style || {};
  return (
    <AppImage
      args={{ heightRelativeToWindow: false }}
      source={iconProps.source}
      onPress={iconProps.onPress}
      resizeMode="contain"
      style={{
        ...iconProps.style,
        height: iconProps.style.height || "100%",
        width: iconProps.style.width || "100%",
      }}
    />
  );
};
