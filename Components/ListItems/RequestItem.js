import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { InfoItem } from "./InfoItem";
import { AppIcon } from "../Icons/AppIcon";
import {
  acceptRequest,
  denyRequest,
  sendNotifications,
} from "../../Utils/Persistence/Actions";
import { Alert } from "react-native";

export default function RequestItem({
  request,
  setLoading,
  reload,
  setLoadingMessage,
}) {
  return (
    <InfoItem
      containerStyle={{ flexDirection: "row" }}
      leftContainerStyle={{ width: "75%" }}
      title={request.senderEmail}
      content={"Join to " + request.projectName + " as " + request.proposedRole}
      right={
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "25%",
          }}
        >
          <AppIcon
            name="check"
            onPress={() =>
              onCheckIconPress(setLoading, request, reload, setLoadingMessage)
            }
            size={50}
          />
          <AppIcon
            name="close"
            onPress={() => onCloseIconPress(setLoading, request, reload)}
            size={50}
          />
        </View>
      }
    />
  );
}

async function onCheckIconPress(
  setLoading,
  request,
  reload,
  setLoadingMessage
) {
  setLoadingMessage("Accepting request");
  setLoading(true);
  const result = await acceptRequest(request);
  setLoadingMessage("Notifying to the project participants");
  const sendNotificationsResult = await sendNotifications(
    request.projectId,
    request.projectName,
    request.receiverEmail + " has joined"
  );
  setLoading(false);
  setLoadingMessage(null);
  await reload();
  if (result.successful) {
    Alert.alert("Great!", "You have joined to " + request.projectName);
  } else {
    Alert.alert("Error", "The request could not be accepted");
  }
  if (!sendNotificationsResult.successful) {
    Alert.alert("Too bad", "The project participants were not notified");
  }
}

async function onCloseIconPress(setLoading, request, reload) {
  setLoading(true);
  const result = await denyRequest(request.id);
  setLoading(false);
  await reload();
  if (result.successful) {
    Alert.alert("Nice!", "The request have been denied");
  } else {
    Alert.alert("Error", "The request could not be denied");
  }
}

const styles = StyleSheet.create({});
