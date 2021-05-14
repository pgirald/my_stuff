import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppObjectListComponent from "../../Components/General/AppObectList/AppObjectListComponent";
import AppItem from "../../Components/ListItems/AppItem";
import { getNotifications } from "../../Utils/Persistence/Actions";

export default function Notifications({ navigation, projectId }) {
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ title: "Notifications", headerRight: null });
    }, [])
  );
  return (
    <AppObjectListComponent
      getObjects={(limit) => getNotifications(projectId, limit)}
      getMoreObjects={(limit, start) =>
        getNotifications(projectId, limit, start)
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
    />
  );
}

const styles = StyleSheet.create({});
