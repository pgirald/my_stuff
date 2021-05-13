import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppView } from "../Containers/AppView";
import AppProgressBar from "../General/AppProgressBar";
import { AppIcon } from "../Icons/AppIcon";
import { appColors } from "../Styles/Colors";
import AppItem from "./AppItem";

export default function ProjectItem({ project, role, onPress = () => {} }) {
  return (
    <AppItem
      left={
        <View style={{ marginLeft: 10, flex: 2, justifyContent: "center" }}>
          <AppIcon name={getIconName(role)} size={65} />
        </View>
      }
      right={
        <AppView style={{ flex: 8, marginLeft: 20 }}>
          <Text style={{ fontWeight: "bold" }}>{String(project.name)}</Text>
          <AppProgressBar
            progressRate={
              (project.activitiesCount === 0
                ? 0
                : (100 * project.doneActivitiesCount) /
                  project.activitiesCount) + "%"
            }
            containerStyle={{ marginTop: 10 }}
          />
        </AppView>
      }
      onPress={() =>
        onPress(
          {
            ...project,
            creationDate: new Date(
              project.creationDate.seconds * 1000
            ).toString(),
            startDate:
              project.startDate &&
              new Date(project.startDate.seconds * 1000).toString(),
            finishDate:
              project.finishDate &&
              new Date(project.finishDate.seconds * 1000).toString(),
            completionDate:
              project.completionDate &&
              new Date(project.completionDate.seconds * 1000).toString(),
          },
          role
        )
      }
    />
  );
}

const getIconName = (userRole) => {
  if (userRole === "owner") {
    return "seat";
  }
  if (userRole === "admin") {
    return "handshake";
  }
  return "account-child-circle";
};

const styles = StyleSheet.create({});
