import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { appColors } from "../../Components/Styles/Colors";
import { AppIcon } from "../../Components/Icons/AppIcon";
import ActivityInfoScreen from "./ActivityInfo/ActivityInfoScreen";
import TasksListScreen from "../Tasks/TasksListScreen";
import ActivityLocationScreen from "./ActivityLocation/ActivityLocationScreen";
import AttachmentsScreen from "../../Components/General/AttachmentsScreen";

const Tab = createBottomTabNavigator();

const screenOptions = (route, color) => {
  let iconName;
  switch (route.name) {
    case "Information":
      iconName = "information";
      break;
    case "Map":
      iconName = "map-marker";
      break;
    case "Attachments":
      iconName = "paperclip";
      break;
    case "ActivityTasksList":
      iconName = "file-tree";
      break;
  }

  return <AppIcon name={iconName} size={30} color={color} />;
};

export default function ActivityTabNavigator({ route }) {
  const navigation = useNavigation();
  const role = route.params.role;
  const [activity, setActivity] = useState(route.params.activity);
  return (
    <Tab.Navigator
      initialRouteName="Information"
      tabBarOptions={{
        activeTintColor: appColors.white,
        inactiveTintColor: appColors.doveGray,
        showLabel: false,
        style: { backgroundColor: appColors.powderBlue },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => screenOptions(route, color),
      })}
      barStyle={{ backgroundColor: appColors.powderBlue }}
    >
      <Tab.Screen
        name="Information"
        children={() => (
          <ActivityInfoScreen
            role={role}
            activity={activity}
            navigation={navigation}
            onActivityUpdated={(updatedActivity) =>
              setActivity(updatedActivity)
            }
          />
        )}
      />
      <Tab.Screen
        name="Attachments"
        children={() => (
          <AttachmentsScreen
            ownerId={activity.id}
            navigation={navigation}
            ownerCollection={"Projects/" + activity.projectId + "/Activities"}
          />
        )}
      />
      <Tab.Screen
        name="Map"
        children={() => (
          <ActivityLocationScreen
            role={role}
            navigation={navigation}
            activity={activity}
            onActivityUpdated={(updatedActivity) =>
              setActivity(updatedActivity)
            }
          />
        )}
      />
      <Tab.Screen
        name="ActivityTasksList"
        children={() => (
          <TasksListScreen
            role={role}
            activitiesRoute={"Projects/" + activity.projectId + "/Activities"}
            activity={activity}
            navigation={navigation}
          />
        )}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
