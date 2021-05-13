import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckBox, Input } from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";
import { AppContainer } from "../../../Components/Containers/AppContainer";
import Loading from "../../../Components/General/Loading";
import {
  onDataChanged,
  onUpdateBtnPress,
  onDiscardBtnPress,
  onDeleteIconPress,
} from "./TaskInfoHandlers";
import Modal from "../../../Components/General/Modal";
import { AppButton } from "../../../Components/Buttons/AppButton";
import { AppView } from "../../../Components/Containers/AppView";
import { appColors } from "../../../Components/Styles/Colors";
import { useNavigation } from "@react-navigation/native";
import { AppIcon } from "../../../Components/Icons/AppIcon";
import { modalButtonStyle } from "../../../Components/Buttons/ModalButtonStyle";

export default function TaskInfoScreen({ route }) {
  const task = route.params.task;
  const role = route.params.role;
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AppIcon
          name="trash-can"
          color={appColors.white}
          size={40}
          onPress={() =>
            onDeleteIconPress({ setLoading }, task, navigation, role)
          }
        />
      ),
    });
  }, []);
  const [defaultData, setDefaultData] = useState({
    name: task.name,
    done: task.done,
    description: task.description,
  });
  const navigation = useNavigation();
  const [data, setData] = useState(defaultData);
  const [nothingChanged, setNothingChanged] = useState(true);
  const [key, setKey] = useState(true);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();
  return (
    <AppContainer key={key} style={styles.container}>
      <TextInput
        style={styles.title}
        value={data.name}
        placeholder="Task name"
        onChangeText={(text) =>
          onDataChanged(
            { data, setData, setNothingChanged, nothingChanged },
            "name",
            text
          )
        }
      />
      <Text
        style={{
          ...styles.description,
          color: data.description ? appColors.black : appColors.silver,
        }}
        onPress={() => modalRef.current.show(true)}
      >
        {getFormatedDescription(data.description)}
      </Text>
      <CheckBox
        style={{ marginVertical: 20 }}
        checked={data.done}
        title="is done"
        onPress={() =>
          onDataChanged(
            { data, setData, setNothingChanged, nothingChanged },
            "done",
            !data.done
          )
        }
        checkedColor={appColors.aquamarineBlue}
        uncheckedColor={appColors.silver}
      />
      <AppView style={{ flexDirection: "row" }}>
        <AppButton
          title="Discard changes"
          style={styles.discardBtn}
          disabled={nothingChanged}
          onPress={() =>
            onDiscardBtnPress(
              { setNothingChanged, setData, key, setKey },
              defaultData
            )
          }
        />
        <AppButton
          title="Update"
          style={styles.updateBtn}
          disabled={nothingChanged}
          onPress={() =>
            onUpdateBtnPress(
              { data, setLoading, setNothingChanged, setDefaultData },
              task,
              defaultData,
              role
            )
          }
        />
      </AppView>
      <Modal modalRef={modalRef}>
        <Input
          multiline={true}
          value={data.description}
          placeholder="Task description goes here"
          onChangeText={(text) =>
            onDataChanged(
              { data, setData, setNothingChanged, nothingChanged },
              "description",
              text
            )
          }
        />
        <AppButton
          style={modalButtonStyle()}
          title="Close"
          onPress={() => modalRef.current.show(false)}
        />
      </Modal>
      <Loading isVisible={loading} />
    </AppContainer>
  );
}

const getFormatedDescription = (description) => {
  if (!description) {
    return "Task description goes here";
  }
  let desc = description.substring(0, 45);
  if (description.length > 45) {
    desc += "...";
  }
  return desc;
};

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  title: { fontSize: 25, marginTop: 10, color: appColors.jumbo },
  description: { marginVertical: 20, fontSize: 15 },
  discardBtn: {
    margin: 20,
    width: "25%",
    height: "5%",
    backgroundColor: appColors.aquamarineBlue,
  },
  updateBtn: {
    margin: 20,
    width: "25%",
    height: "5%",
    alignSelf: "center",
    backgroundColor: appColors.flamingo,
  },
});
