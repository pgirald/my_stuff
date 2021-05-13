import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppView } from "../Containers/AppView";
import AppProgressBar from "../General/AppProgressBar";
import { AppIcon } from "../Icons/AppIcon";
import { appColors } from "../Styles/Colors";
import AppItem from "./AppItem";
import { FileIcon, defaultStyles } from "react-file-icon";

export default function FileItem({ file, onPress = () => {} }) {
  return (
    <AppItem
      left={
        <View style={{ marginLeft: 10, flex: 2, justifyContent: "center" }}>
          <AppIcon
            name={getIconName(file.type)}
            color={appColors.shakespeare}
            size={50}
          />
        </View>
      }
      right={
        <AppView style={{ flex: 8, marginLeft: 20 }}>
          <Text style={{ fontWeight: "bold" }}>{file.displayName}</Text>
        </AppView>
      }
      onPress={() => onPress(file)}
    />
  );
}

const getIconName = (fileType) => {
  let iconName;
  switch (fileType) {
    case "png":
    case "jpg":
    case "jpeg":
      iconName = "file-image";
      break;
    case "pdf":
      iconName = "file-pdf";
      break;
    case "docx":
    case "doc":
      iconName = "file-word";
      break;
    case "xls":
    case "xlsx":
      iconName = "file-excel";
      break;
    case "txt":
      iconName = "file-document";
      break;
    default:
      iconName = "file-question";
      break;
  }
  return iconName;
};

const styles = StyleSheet.create({});
