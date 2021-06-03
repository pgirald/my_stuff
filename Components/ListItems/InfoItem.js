import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppView } from "../Containers/AppView";
import { appColors } from "../Styles/Colors";

const styles = StyleSheet.create({});

export function InfoItem({
  title,
  content,
  right,
  leftContainerStyle,
  containerStyle = {},
}) {
  return (
    <AppView
      style={{
        ...containerStyle,
        borderBottomWidth: 1,
        borderBottomColor: appColors.silver,
        width: "100%",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={leftContainerStyle}>
          <Text
            style={{
              marginLeft: 10,
              marginTop: 10,
              marginBottom: 5,
              fontSize: 15,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              color: appColors.silver,
              marginLeft: 10,
              marginBottom: 5,
              fontSize: 12,
            }}
          >
            {content}
          </Text>
        </View>
        {right}
      </View>
    </AppView>
  );
}
