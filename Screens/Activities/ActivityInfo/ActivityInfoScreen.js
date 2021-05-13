import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { CheckBox, Input } from "react-native-elements";
import { AppButton } from "../../../Components/Buttons/AppButton";
import { modalButtonStyle } from "../../../Components/Buttons/ModalButtonStyle";
import { AppContainer } from "../../../Components/Containers/AppContainer";
import { AppView } from "../../../Components/Containers/AppView";
import AppTimer from "../../../Components/General/AppTimer";
import Loading from "../../../Components/General/Loading";
import Modal from "../../../Components/General/Modal";
import { AppIcon } from "../../../Components/Icons/AppIcon";
import DatesInput from "../../../Components/Inputs/DatesInput";
import { appColors } from "../../../Components/Styles/Colors";
import {
  onDataChanged,
  onDateChanged,
  onDeleteIconPress,
  onDiscardBtnPress,
  onUpdateBtnPress,
} from "./ActivityInfoHandlers";

export default function ActivityInfoScreen({
  activity,
  onActivityUpdated,
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
              onDeleteIconPress({ setLoading }, navigation, activity, role)
            }
          />
        ),
        title: "Activity information",
      });
    }, [])
  );
  const defaultData = {
    name: activity.name,
    projectId: activity.projectId,
    startDate: activity.startDate && new Date(activity.startDate),
    finishDate: activity.finishDate && new Date(activity.finishDate),
    done: activity.done,
    description: activity.description,
  };
  const [data, setData] = useState(defaultData);
  const [key, setKey] = useState(true);
  const [nothingChanged, setNothingChanged] = useState(true);
  const [loading, setLoading] = useState(false);
  const dates = useRef({
    startDate: defaultData.startDate,
    finishDate: defaultData.finishDate,
  });
  const [milliseconds, setMilliseconds] = useState(
    getMilliseconds(dates.current)
  );
  const modalRef = useRef();
  return (
    <AppContainer style={styles.container} key={key}>
      <AppView style={styles.title}>
        <CheckBox
          checked={data.done}
          onPress={() =>
            onDataChanged(
              { data, setData, nothingChanged, setNothingChanged },
              "done",
              !data.done
            )
          }
          checkedColor={appColors.aquamarineBlue}
          uncheckedColor={appColors.silver}
          right={true}
        />
        <TextInput
          style={styles.titleText}
          onChangeText={(text) =>
            onDataChanged(
              { data, setData, nothingChanged, setNothingChanged },
              "name",
              text
            )
          }
          defaultValue={data.name}
        />
      </AppView>
      <Text
        style={styles.description}
        onPress={() => modalRef.current.show(true)}
      >
        {(!isEmpty(data.description) &&
          getDescriptionFormated(data.description)) ||
          "Put a description here"}
      </Text>
      <AppTimer initialMilliseconds={milliseconds} />
      <DatesInput
        containerStyle={styles.dates}
        initialStartDate={data.startDate}
        initialFinishDate={data.finishDate}
        onStartDateChanged={(date) =>
          onDateChanged(
            {
              data,
              setData,
              nothingChanged,
              setNothingChanged,
              setMilliseconds,
            },
            "startDate",
            date,
            getMilliseconds,
            dates
          )
        }
        onFinishDateChanged={(date) =>
          onDateChanged(
            {
              data,
              setData,
              nothingChanged,
              setNothingChanged,
              setMilliseconds,
            },
            "finishDate",
            date,
            getMilliseconds,
            dates
          )
        }
      />
      <AppView style={{ flexDirection: "row" }}>
        <AppButton
          title="Discard changes"
          style={styles.discardBtn}
          disabled={nothingChanged}
          onPress={() =>
            onDiscardBtnPress(
              { setNothingChanged, setData, key, setKey, setMilliseconds },
              defaultData,
              dates,
              getMilliseconds
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
              activity,
              onActivityUpdated,
              defaultData,
              role
            )
          }
        />
      </AppView>
      <Modal modalRef={modalRef}>
        <Input
          placeholder="Description goes here"
          multiline={true}
          value={data.description}
          onChangeText={(text) =>
            onDataChanged(
              { data, setData, nothingChanged, setNothingChanged },
              "description",
              text
            )
          }
        />
        <AppButton
          title="Close"
          onPress={() => modalRef.current.show(false)}
          style={modalButtonStyle()}
        />
      </Modal>
      <Loading isVisible={loading} />
    </AppContainer>
  );
}

const getMilliseconds = (dates) => {
  const now = new Date();
  if (dates.startDate && dates.finishDate) {
    if (now <= dates.finishDate && now > dates.startDate) {
      return dates.finishDate - now;
    }
  }
  return 0;
};

const getDescriptionFormated = (description) => {
  let desc = description.substring(0, 45);
  if (description.length > 45) {
    desc += "...";
  }
  return desc;
};

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  title: {
    marginTop: 30,
    marginBottom: 10,
    flexDirection: "row",
  },
  titleText: {
    alignSelf: "center",
    fontSize: 30,
    color: appColors.jumbo,
  },
  description: { fontSize: 15, color: appColors.silver, marginBottom: 25 },
  discardBtn: {
    margin: 30,
    width: "35%",
    height: "6%",
    backgroundColor: appColors.aquamarineBlue,
  },
  updateBtn: {
    margin: 30,
    width: "35%",
    height: "6%",
    alignSelf: "center",
    backgroundColor: appColors.flamingo,
  },
  dates: { marginVertical: 30 },
});
