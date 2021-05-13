import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { appColors } from "./Colors";
import { Icon, Input } from "react-native-elements";
import Modal from "../General/Modal";
import { AppView } from "../Containers/AppView";
import { AppIcon } from "../Icons/AppIcon";
import { AppButton } from "../Buttons/AppButton";
import { modalButtonStyle } from "../Buttons/ModalButtonStyle";
import { isEmpty } from "lodash";

export const appStackOptions = (stackTitle, showHeader = true) => {
  return {
    title: stackTitle,
    headerBackground: () => (
      <View
        style={{
          backgroundColor: appColors.robbinsEggBlue,
          height: "100%",
          width: "100%",
        }}
      ></View>
    ),
    headerTitleStyle: { color: appColors.white },
    headerLeft: showHeader ? (props) => <LeftButton /> : undefined,
  };
};

function LeftButton() {
  const navigation = useNavigation();
  return (
    <Icon
      type="material-community"
      name="menu-left"
      size={60}
      color={appColors.white}
      onPress={() => navigation.goBack()}
    />
  );
}
