import React from "react";
import { StyleSheet } from "react-native";
import { Image } from "react-native-elements";
import {
  getHeightRelativeToWindow,
  getWidthRelativeToWindow,
} from "../../Utils/General/WindowDimensions";
import { AppView } from "../Containers/AppView";
import { styleMapper } from "../Containers/AppViewStyleMapper";
import { appDefaultStyle } from "../Styles/AppDefaultStyle";
import { getAppStyle } from "../Styles/AppStyle";

export const AppImage = ({
  source,
  resizeMode,
  onPress,
  style = {},
  args = {},
}) => {
  return (
    <AppView
      args={args}
      style={{ ...styleMapper(style), alignSelf: style.alignSelf }}
    >
      <Image
        source={source}
        resizeMode={resizeMode}
        onPress={onPress}
        style={{
          ...style,
          alignSelf: undefined,
          ...appDefaultStyle(undefined, { position: true }),
        }}
      />
    </AppView>
  );
};
