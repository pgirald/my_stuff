import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppView } from "../Containers/AppView";
import { appColors } from "../Styles/Colors";

export default function AppItem({ left, right, height, onPress = () => {} }) {
  const styles = getStyle(height);
  return (
    <TouchableOpacity onPress={onPress}>
      <AppView style={styles.itemContainer}>
        {left}
        {right}
      </AppView>
    </TouchableOpacity>
  );
}

const getStyle = (height = "8%") =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: "row",
      width: "100%",
      height: height,
      borderBottomColor: appColors.silver,
      borderBottomWidth: 1,
    },
  });
