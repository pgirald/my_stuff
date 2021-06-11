import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import CreateAccountScreen from "../Account/CreateAccount/CreateAccountScreen";
import MyStuffScreen from "./MyStuffScreen";
import { appStackOptions } from "../../Components/Styles/AppStackStyle";
import AccountInfoScreen from "../Account/AccountInfo/AccountInfoScreen";
import ProjectsListScreen from "../Projects/ProjectsListScreen";
import ProjectTabNavigator from "../Projects/ProjectTabNavigator";
import ActivityTabNavigator from "../Activities/ActivityTabNavigator";
import TaskInfoScreen from "../Tasks/TaskInfo/TaskInfoScreen";
import ParticipantInfoComponent from "../Projects/ParticipantInfo/ParticipantInfoComponent";
import Requests from "../Requests";

const Stack = createStackNavigator();

export default function MainSreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={MyStuffScreen}
        options={{ headerShown: false, ...appStackOptions("Welcome", false) }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={appStackOptions("Create account")}
      />
      <Stack.Screen
        name="Account"
        component={AccountInfoScreen}
        options={appStackOptions("Account")}
      />
      <Stack.Screen
        name="Projects"
        component={ProjectsListScreen}
        options={appStackOptions(undefined)}
      />
      <Stack.Screen
        name="ProjectTabNavigator"
        component={ProjectTabNavigator}
        options={appStackOptions("Project")}
      />
      <Stack.Screen
        name="ActivityTabNavigator"
        component={ActivityTabNavigator}
        options={appStackOptions("Activity")}
      />
      <Stack.Screen
        name="TaskInfoScreen"
        component={TaskInfoScreen}
        options={appStackOptions("Task information")}
      />
      <Stack.Screen
        name="ParticipantInfo"
        component={ParticipantInfoComponent}
        options={appStackOptions("Parcitipant information")}
      />
      <Stack.Screen
        name="Requests"
        component={Requests}
        options={appStackOptions(undefined)}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
