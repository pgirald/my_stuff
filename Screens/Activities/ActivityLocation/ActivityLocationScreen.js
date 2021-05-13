import { useFocusEffect } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppContainer } from "../../../Components/Containers/AppContainer";
import { AppView } from "../../../Components/Containers/AppView";
import Loading from "../../../Components/General/Loading";
import MapScreen from "../../../Components/General/Map/MapScreen";
import { onAdressSpecified } from "./ActivityLocationHandlers";

export default function ActivityLocationScreen({
  activity,
  navigation,
  onActivityUpdated,
}) {
  useEffect(() => {
    navigation.setOptions({ title: "Location", headerRight: null });
  }, []);
  const [loading, setLoading] = useState(false);
  return (
    <AppContainer>
      <MapScreen
        defaultAdress={activity.adress}
        defaultRegion={activity.location}
        onAdressSpecified={(region, adress) =>
          onAdressSpecified(
            setLoading,
            region,
            adress,
            activity,
            onActivityUpdated
          )
        }
      />
      <Loading isVisible={loading} />
    </AppContainer>
  );
}

const styles = StyleSheet.create({});
