import React from "react";
import { Text, View } from "react-native";
import { AppView } from "../Containers/AppView";
import { AppIcon } from "../Icons/AppIcon";
import AppItem from "./AppItem";

export default function TaskItem({ task, onPress = () => {} }) {
  return (
    <AppItem
      left={
        <View style={{ marginLeft: 10, flex: 2, justifyContent: "center" }}>
          <AppIcon name={task.done ? "check" : "close"} size="7%" />
        </View>
      }
      right={
        <AppView style={{ flex: 8, marginLeft: 20 }}>
          <Text style={{ fontWeight: "bold" }}>{task.name}</Text>
        </AppView>
      }
      onPress={() =>
        onPress({
          ...task,
          creationDate:
            task.creationDate &&
            new Date(task.creationDate.seconds * 1000).toString(),
          completionDate:
            task.completionDate &&
            new Date(task.completionDate.seconds * 1000).toString(),
        })
      }
    />
  );
}
