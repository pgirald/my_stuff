import React from "react";
import { ActivityIndicator, ImageBackgroundBase } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Image, Overlay } from "react-native-elements";
import { appColors } from "../Styles/Colors";

export default function Loading({
  isVisible,
  text,
  children,
  backgroundColor = "transparent",
}) {
  const styles = getStyles(backgroundColor);
  return (
    <Overlay isVisible={isVisible} overlayStyle={styles.Overlay}>
      <View style={styles.view}>
        <ActivityIndicator size="large" color={appColors.aquamarineBlue} />
        {text && (
          <View style={styles.textContainer}>
            <Text style={styles.text}>{text}</Text>
          </View>
        )}
        {children}
      </View>
    </Overlay>
  );
}

const getStyles = (backgroundColor) =>
  StyleSheet.create({
    Overlay: {
      height: "100%",
      width: "100%",
      backgroundColor: backgroundColor,
    },
    view: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: appColors.black,
      marginTop: 10,
      alignSelf: "center",
      marginBottom: 10,
      marginHorizontal: 5,
    },
    textContainer: {
      backgroundColor: appColors.white,
      borderRadius: 10,
    },
  });
