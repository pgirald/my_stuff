import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import { ActivityIndicator } from "react-native";
import { AppView } from "../Containers/AppView";
import AppProgressBar from "../General/AppProgressBar";
import AppItem from "./AppItem";
import { appColors } from "../Styles/Colors";

export default function ParticipantItem({ participant, onPress = () => {} }) {
  return (
    <AppItem
      left={
        <View style={{ marginLeft: 10, flex: 1, justifyContent: "center" }}>
          <Avatar
            rounded={true}
            size="medium"
            source={
              participant.photoUrl || require("../../assets/avatar-default.jpg")
            }
            renderPlaceholderContent={
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color={appColors.white} />
              </View>
            }
          />
        </View>
      }
      right={
        <AppView style={{ flex: 8, marginLeft: 20 }}>
          <Text style={{ fontWeight: "bold" }}>
            {String(participant.email)}
          </Text>
        </AppView>
      }
      onPress={() =>
        onPress({
          ...participant,
          creationDate: new Date(
            participant.creationDate.seconds * 1000
          ).toString(),
        })
      }
    />
  );
}
