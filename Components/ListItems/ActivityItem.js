import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppView } from "../Containers/AppView";
import AppProgressBar from "../General/AppProgressBar";
import { AppIcon } from "../Icons/AppIcon";
import { appColors } from "../Styles/Colors";
import AppItem from "./AppItem";

export default function ActivityItem({ activity, onPress = () => {} }) {
  activity = {
    ...activity,
    creationDate: new Date(activity.creationDate.seconds * 1000),
    startDate:
      activity.startDate && new Date(activity.startDate.seconds * 1000),
    finishDate:
      activity.finishDate && new Date(activity.finishDate.seconds * 1000),
    completionDate:
      activity.completionDate &&
      new Date(activity.completionDate.seconds * 1000),
  };
  const [lapsedTimeRate, color] = getActivityState(activity);
  return (
    <AppItem
      left={
        <View style={{ marginLeft: 10, flex: 2 }}>
          <AppIcon
            name="clock-time-twelve-outline"
            size={65}
            color={color}
            rotatationDegree={lapsedTimeRate * 360}
          />
        </View>
      }
      right={
        <AppView style={{ flex: 8, marginLeft: 20 }}>
          <Text style={{ fontWeight: "bold" }}>{String(activity.name)}</Text>
          <AppProgressBar
            progressRate={
              (activity.tasksCount === 0
                ? 0
                : (100 * activity.doneTasksCount) / activity.tasksCount) + "%"
            }
            containerStyle={{ marginTop: 10 }}
          />
        </AppView>
      }
      onPress={() =>
        onPress({
          ...activity,
          creationDate:
            activity.creationDate && activity.creationDate.toString(),
          startDate: activity.startDate && activity.startDate.toString(),
          finishDate: activity.finishDate && activity.finishDate.toString(),
          completionDate:
            activity.completionDate && activity.completionDate.toString(),
        })
      }
    />
  );
}

const getActivityState = (activity) => {
  let lapsedTimeRate = 0;
  let color;
  let now = new Date();
  if (activity.startDate && activity.finishDate) {
    if (now > activity.finishDate) {
      if (activity.done) {
        if (activity.completionDate > activity.finishDate) {
          color = appColors.laserLemon;
        } else {
          color = appColors.mintGreen;
        }
      } else {
        color = appColors.bittersweet;
      }
    } else {
      if (now > activity.startDate) {
        lapsedTimeRate =
          (now - activity.startDate) /
          (activity.finishDate - activity.startDate);
      }
      if (activity.done) {
        color = appColors.mintGreen;
      }
    }
  }
  return [lapsedTimeRate, color];
};

const styles = StyleSheet.create({});
