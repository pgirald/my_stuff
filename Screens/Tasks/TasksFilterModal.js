import { isEmpty } from "lodash";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ButtonGroup, Input } from "react-native-elements";
import FilterModal from "../../Components/General/FilterModal";
import { appColors } from "../../Components/Styles/Colors";

export default function TasksFilterModal({
  modalRef,
  onFilterEnabled,
  onFilterDisabled,
}) {
  const [name, setName] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const labels = ["done", "undone"];
  const values = ["true", "false"];
  return (
    <FilterModal
      modalRef={modalRef}
      onFilterBtnPress={() =>
        onFilterBtnPress({ selectedIndex, name }, onFilterEnabled, values)
      }
      onFilterDisabled={() =>
        onFilterDisabledBtnPress(
          { setName, setSelectedIndex },
          onFilterDisabled
        )
      }
    >
      <Input
        onChangeText={(text) => setName(text)}
        placeholder="Name"
        value={name}
      />
      <ButtonGroup
        selectedButtonStyle={{ backgroundColor: appColors.powderBlue }}
        buttons={labels}
        selectedIndex={selectedIndex}
        onPress={setSelectedIndex}
        textStyle={{ textAlign: "center", fontWeight: "bold", fontSize: 15 }}
        containerStyle={{
          alignSelf: "center",
          borderRadius: 100,
          width: 200,
          height: 30,
          marginBottom: 20,
        }}
      />
    </FilterModal>
  );
}

function onFilterDisabledBtnPress(args, onFilterDisabled) {
  args.setName(null);
  args.setSelectedIndex(-1);
  onFilterDisabled();
}

function onFilterBtnPress(args, onFilterEnabled, values) {
  if (args.selectedIndex === -1 && isEmpty(args.name)) {
    Alert.alert("Error", "You must specify something to filter");
    return false;
  }
  const filterObj = {};
  if (args.selectedIndex !== -1) {
    filterObj.done = ["=", `${values[args.selectedIndex]}`];
  }
  if (!isEmpty(args.name)) {
    filterObj.name = ["=", `'${args.name}'`];
  }
  onFilterEnabled(filterObj);
  return true;
}
