import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text } from "react-native";
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
              onDeleteIconPress({ setLoading }, participant, navigation, role)
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
  const namesRegex = /^([A-Za-z ]+)@([A-Za-z ]+)$/;
  const names = participant.name && participant.name.match(namesRegex);
  return (
    <AppContainer key={key} style={styles.container}>
      <Avatar
        rounded={true}
        size="xlarge"
        source={require("../../../assets/avatar-default.jpg")}
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
              { setLoading, key, setKey },
              participant,
              newRole,
              role
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
      <InfoItem title="Email" content={participant.email} />
      <InfoItem
        title="First names"
        content={(names && names[1]) || "Not specified"}
      />
      <InfoItem
        title="Last names"
        content={(names && names[2]) || "Not specified"}
      />
      <InfoItem title="Phone" content={participant.phone || "Not specified"} />
      <Loading isVisible={loading} />
    </AppContainer>
  );
}

const iconsProperties = [
  {
    source: require("../../../assets/whatsapp.png"),
    style: { height: 43 },
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
