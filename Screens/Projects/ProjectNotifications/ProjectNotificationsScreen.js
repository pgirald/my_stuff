import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ProjectNotificationsScreen({navigation}) {
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ title: "Notifications", headerRight: null});
    }, [])
  );
  return (
    <View>
      <Text>Project Notifications</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
