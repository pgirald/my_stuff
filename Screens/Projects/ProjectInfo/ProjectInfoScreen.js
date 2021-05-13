import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useGestureHandlerRef } from "@react-navigation/stack";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Input } from "react-native-elements";
import { AppButton } from "../../../Components/Buttons/AppButton";
import { AppContainer } from "../../../Components/Containers/AppContainer";
import { AppView } from "../../../Components/Containers/AppView";
import Loading from "../../../Components/General/Loading";
import { AppIcon } from "../../../Components/Icons/AppIcon";
import { AppImage } from "../../../Components/Icons/AppImage";
import { Logo } from "../../../Components/Icons/Logo";
import DatesInput from "../../../Components/Inputs/DatesInput";
import { appColors } from "../../../Components/Styles/Colors";
import { getCurrentUser } from "../../../Utils/Persistence/Actions";
import {
  onDataChanged,
  onDeleteIconPress,
  onDiscardBtnPress,
  onUpdateBtnPress,
} from "./ProjectInfoHandlers";

export default function ProjectInfoScreen({
  project,
  onProjectUpdated,
  navigation,
  role,
}) {
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <AppIcon
            name="trash-can"
            color={appColors.white}
            size={40}
            onPress={() =>
              onDeleteIconPress({ setLoading }, navigation, project, role)
            }
          />
        ),
        title: "Project information",
      });
    }, [])
  );
  const [data, setData] = useState({
    name: project.name,
    owner: project.owner,
    startDate: project.startDate && new Date(project.startDate),
    finishDate: project.finishDate && new Date(project.finishDate),
  });
  const [key, setKey] = useState(true);
  const [nothingChanged, setNothingChanged] = useState(true);
  const [loading, setLoading] = useState(false);
  return (
    <AppContainer style={styles.container} key={key}>
      <TextInput
        style={styles.title}
        onChangeText={(text) =>
          onDataChanged(
            { data, setData, nothingChanged, setNothingChanged },
            "name",
            text
          )
        }
        defaultValue={data.name}
      />
      <TextInput
        style={styles.ownerEmail}
        onChangeText={(text) =>
          onDataChanged(
            { data, setData, nothingChanged, setNothingChanged },
            "owner",
            text
          )
        }
        defaultValue={getCurrentUser().email}
      />
      <DatesInput
        containerStyle={styles.dates}
        initialStartDate={data.startDate}
        initialFinishDate={data.finishDate}
        onStartDateChanged={(date) =>
          onDataChanged(
            { data, setData, nothingChanged, setNothingChanged },
            "startDate",
            date
          )
        }
        onFinishDateChanged={(date) =>
          onDataChanged(
            { data, setData, nothingChanged, setNothingChanged },
            "finishDate",
            date
          )
        }
      />
      <Logo source={require("../../../assets/logo.png")} style={styles.logo} />
      <AppView style={{ flexDirection: "row" }}>
        <AppButton
          title="Discard changes"
          style={styles.discardBtn}
          disabled={nothingChanged}
          onPress={() =>
            onDiscardBtnPress(
              { setNothingChanged, setData, key, setKey },
              project
            )
          }
        />
        <AppButton
          title="Update"
          style={styles.updateBtn}
          disabled={nothingChanged}
          onPress={() =>
            onUpdateBtnPress(
              { data, setLoading, setNothingChanged },
              project,
              onProjectUpdated,
              role
            )
          }
        />
      </AppView>
      <AppImage
        source={require("../../../assets/timeline.png")}
        resizeMode="stretch"
        style={styles.timeline}
      />
      <Loading isVisible={loading} />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  title: { fontSize: 25, marginTop: 10, color: appColors.jumbo },
  ownerEmail: { fontSize: 15, color: appColors.silver },
  logo: {
    height: "30%",
    width: "100%",
    marginVertical: 20,
    transform: [{ rotate: "-15deg" }],
  },
  timeline: {
    height: "5%",
    width: "95%",
    margin: 15,
  },
  discardBtn: {
    margin: 20,
    width: "35%",
    height: "6%",
    backgroundColor: appColors.aquamarineBlue,
  },
  updateBtn: {
    margin: 20,
    width: "35%",
    height: "6%",
    alignSelf: "center",
    backgroundColor: appColors.flamingo,
  },
  dates: { marginVertical: 15 },
});
