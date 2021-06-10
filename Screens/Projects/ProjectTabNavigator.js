import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ProjectInfoScreen from "./ProjectInfo/ProjectInfoScreen";
import { appColors } from "../../Components/Styles/Colors";
import { AppIcon } from "../../Components/Icons/AppIcon";
import ActivitiesListScreen from "../Activities/ActivitiesListScreen";
import ParticipantsList from "./ParticipantsList";
import Notifications from "./Notifications";
import AttachmentsScreen from "../../Components/General/AttachmentsScreen";

const Tab = createBottomTabNavigator();

const screenOptions = (route, color) => {
  let iconName;
  switch (route.name) {
    case "Information":
      iconName = "information";
      break;
    case "Participants":
      iconName = "account-group";
      break;
    case "Notifications":
      iconName = "bell";
      break;
    case "Attachments":
      iconName = "paperclip";
      break;
    case "ActivitiesList":
      iconName = "view-list";
      break;
  }

  return <AppIcon name={iconName} size={30} color={color} />;
};

export default function ProjectTabNavigator({ route }) {
  const navigation = useNavigation();
  const role = route.params.role;
  const [project, setProject] = useState(route.params.project);
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
          <ProjectInfoScreen
            role={role}
            project={project}
            navigation={navigation}
            onProjectUpdated={(updatedProject) => setProject(updatedProject)}
          />
        )}
      />
      <Tab.Screen
        name="Participants"
        children={() => (
          <ParticipantsList
            navigation={navigation}
            project={project}
            role={role}
          />
        )}
      />
      <Tab.Screen
        name="Attachments"
        children={() => (
          <AttachmentsScreen
            ownerId={project.id}
            navigation={navigation}
            ownerCollection="Projects"
          />
        )}
      />
      <Tab.Screen
        name="Notifications"
        children={() => (
          <Notifications navigation={navigation} projectId={project.id} />
        )}
      />
      <Tab.Screen
        name="ActivitiesList"
        children={() => (
          <ActivitiesListScreen
            project={project}
            navigation={navigation}
            role={role}
          />
        )}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
