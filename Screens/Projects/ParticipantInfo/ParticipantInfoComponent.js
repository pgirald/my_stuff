import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import { AppContainer } from "../../../Components/Containers/AppContainer";
import { AppIcon } from "../../../Components/Icons/AppIcon";
import { IconsContainer } from "../../../Components/Icons/IconsContainer";
import { RoleSelect } from "../../../Components/Inputs/RoleSelect";
import { appColors } from "../../../Components/Styles/Colors";
import Loading from "../../../Components/General/Loading";
import {
  onDeleteIconPress,
  onParticipantRoleChanged,
} from "./ParticipantInfoHandlers";
import { InfoItem } from "../../../Components/ListItems/InfoItem";
import {
  callNumber,
  sendEmail,
  sendWhatsApp,
} from "../../../Utils/General/Communication";

export default function ParticipantInfoComponent({ route }) {
  const role = route.params.role;
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <AppIcon
            containerStyle={{ marginRight: 5 }}
            name="account-minus"
            color={appColors.white}
            size={50}
            onPress={() =>
              onDeleteIconPress(
                { setLoading, setLoadingMessage },
                participant,
                navigation,
                role,
                route.params.project
              )
            }
          />
        ),
        title: participant.name,
      });
    }, [])
  );
  const participant = route.params.participant;
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const namesRegex = /^([A-Za-z ]+)@([A-Za-z ]+)/;
  const names = participant.name && participant.name.match(namesRegex);
  const iconsProperties = [
    {
      source: require("../../../assets/whatsapp.png"),
      style: { height: 43 },
      onPress: () => sendWhatsApp(participant.phone),
    },
    {
      source: require("../../../assets/facebook.png"),
      style: { height: 40 },
    },
    {
      source: require("../../../assets/google.png"),
      style: { height: 40 },
    },
  ];
  return (
    <AppContainer key={key} style={styles.container}>
      <Avatar
        rounded={true}
        size="xlarge"
        source={
          participant.photoUrl
            ? { uri: participant.photoUrl }
            : require("../../../assets/avatar-default.jpg")
        }
        containerStyle={styles.avatar}
      />
      {participant.role === "owner" ? (
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 15,
            backgroundColor: appColors.flamingo,
            color: "#FFFFFF",
            borderRadius: 10,
            width: 100,
            height: 30,
            textAlign: "center",
            textAlignVertical: "center",
            marginTop: 5,
          }}
        >
          Owner
        </Text>
      ) : (
        <RoleSelect
          onRoleChanged={(newRole) => {
            onParticipantRoleChanged(
              { setLoading, setLoadingMessage, key, setKey },
              participant,
              newRole,
              role,
              route.params.project
            );
          }}
          containerStyle={{
            marginTop: 5,
          }}
          defaultRole={participant.role}
        />
      )}
      <IconsContainer
        style={styles.iconsContainer}
        iconsProps={iconsProperties}
      />
      <InfoItem
        title="Email"
        content={participant.email}
        right={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <AppIcon
              name="email"
              size={40}
              onPress={() =>
                sendEmail(
                  participant.email,
                  "About " + route.params.project.name
                )
              }
            />
          </View>
        }
      />
      <InfoItem
        title="First names"
        content={(names && names[1]) || "Not specified"}
      />
      <InfoItem
        title="Last names"
        content={(names && names[2]) || "Not specified"}
      />
      <InfoItem
        title="Phone"
        content={participant.phone || "Not specified"}
        right={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <AppIcon
              name="phone"
              size={40}
              onPress={() => callNumber(participant.phone)}
            />
          </View>
        }
      />
      <Loading isVisible={loading} text={loadingMessage} />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  avatar: { marginTop: 10 },
  iconsContainer: {
    height: "4%",
    width: "50%",
    marginTop: 10,
    marginBottom: 20,
  },
});
