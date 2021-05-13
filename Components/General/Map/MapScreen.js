import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { defaultStyles } from "react-file-icon";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import MapView from "react-native-maps";
import { AppButton } from "../../../Components/Buttons/AppButton";
import FloatingButton from "../../../Components/Buttons/FloatingButton";
import { AppContainer } from "../../../Components/Containers/AppContainer";
import { AppView } from "../../../Components/Containers/AppView";
import Loading from "../../../Components/General/Loading";
import { AppIcon } from "../../../Components/Icons/AppIcon";
import { appColors } from "../../../Components/Styles/Colors";
import { getAdress } from "../../../Utils/General/Location";
import {
  onConfirmBtnPress,
  onFirstRender,
  onMapsIconPress,
} from "./MapHandlers";

export default function MapScreen({
  defaultRegion,
  defaultAdress,
  onAdressSpecified,
}) {
  const [region, setRegion] = useState(defaultRegion);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [adress, setAdress] = useState(defaultAdress);
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      onFirstRender(
        { setRegion, setLoadingText, setLoading },
        navigation,
        defaultRegion
      );
    }, [])
  );
  return (
    <AppContainer>
      {region && (
        <View>
          <MapView
            style={{ height: "100%", width: "100%" }}
            initialRegion={region}
            showsUserLocation={true}
            onRegionChange={(region) => setRegion(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
            />
          </MapView>
          <AppView style={styles.adressContainer}>
            <Input
              value={adress}
              placeholder="Adress"
              inputContainerStyle={styles.adressInput}
              onChange={(e) => setAdress(e.nativeEvent.text)}
              rightIcon={
                <AppIcon
                  name="google-maps"
                  color={appColors.black}
                  onPress={() =>
                    onMapsIconPress(
                      {
                        setLoading,
                        setLoadingText,
                        setAdress,
                        region,
                      },
                      onAdressSpecified,
                      defaultAdress,
                      defaultRegion
                    )
                  }
                />
              }
            />
          </AppView>
          <FloatingButton
            icon={<AppIcon name="check" />}
            onPress={() =>
              onConfirmBtnPress(
                { region, adress },
                onAdressSpecified,
                defaultAdress,
                defaultRegion
              )
            }
          />
        </View>
      )}
      <Loading isVisible={loading} text={loadingText} />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  adressContainer: {
    alignSelf: "center",
    position: "absolute",
    backgroundColor: appColors.white,
    top: 5,
    width: "65%",
    height: "6%",
    borderRadius: 200,
    borderColor: appColors.black,
    borderWidth: 1,
  },
  adressInput: { borderBottomWidth: 0 },
});
