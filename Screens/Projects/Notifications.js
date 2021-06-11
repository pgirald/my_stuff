import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppObjectListComponent from "../../Components/General/AppObectList/AppObjectListComponent";
import AppItem from "../../Components/ListItems/AppItem";
import { getNotifications } from "../../Utils/Persistence/Actions";
import NotificationsFilterModal from "./NotificationsFilterModal";

export default function Notifications({ navigation, projectId }) {
  return (
    <AppObjectListComponent
      options={{ title: "Notifications" }}
      navigation={navigation}
      getObjects={(limit, start, filterObj) =>
        getNotifications(projectId, limit, start, filterObj)
      }
      renderItem={(notificationElement) => (
        <AppItem
          left={
            <View
              style={{
                height: "100%",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ textAlign: "center", textAlignVertical: "center" }}
              >
                {notificationElement.item.text}
              </Text>
            </View>
          }
        />
      )}
      FilterModal={NotificationsFilterModal}
    />
  );
}

const styles = StyleSheet.create({});
