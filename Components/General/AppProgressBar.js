import { getCameraRollPermissionsAsync } from "expo-image-picker";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppView } from "../Containers/AppView";
import { appColors } from "../Styles/Colors";

export default function AppProgressBar({
  progressRate,
  width,
  containerStyle,
}) {
  const styles = getStyles(progressRate, width);
  return (
    <View style={containerStyle}>
      <AppView style={styles.container}>
        <AppView style={styles.progressBar} />
      </AppView>
    </View>
  );
}

function getStyles(progressRate, width = "70%") {
  const [rate, color] = getProgressAppereance(progressRate);
  return StyleSheet.create({
    container: {
      alignSelf: "flex-start",
      borderRadius: 360,
      width: width,
      height: 17,
      borderColor: appColors.regentGray,
      borderWidth: 1,
      justifyContent: "center",
    },
    progressBar: {
      alignSelf: "flex-start",
      margin: 0,
      padding: 0,
      borderRadius: 360,
      width: rate,
      height: 15,
      backgroundColor: color,
    },
  });
}

function getProgressAppereance(progressRate) {
  let chars = Array.from(progressRate);
  chars.pop();
  const rateNumber = Number(chars.join(""));
  const rate = rateNumber > 0 && rateNumber < 7 ? "7%" : rateNumber + "%";
  if (rateNumber < 40) {
    return [rate, appColors.bittersweet];
  }
  if (rateNumber < 100) {
    return [rate, appColors.laserLemon];
  }
  return [rate, appColors.mintGreen];
}
