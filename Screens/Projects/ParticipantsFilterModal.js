import { isEmpty } from "lodash";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ButtonGroup, Input } from "react-native-elements";
import FilterModal from "../../Components/General/FilterModal";
import { RoleSelect } from "../../Components/Inputs/RoleSelect";
import { appColors } from "../../Components/Styles/Colors";

export default function ParticipantsFilterModal({
  modalRef,
  onFilterEnabled,
  onFilterDisabled,
}) {
  const [email, setEmail] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const buttons = ["admin", "guest", "owner"];
  return (
    <FilterModal
      modalRef={modalRef}
      onFilterBtnPress={() =>
        onFilterBtnPress({ selectedIndex, email }, onFilterEnabled, buttons)
      }
      onFilterDisabled={() =>
        onFilterDisabledBtnPress(
          { setEmail, setSelectedIndex },
          onFilterDisabled
        )
      }
    >
      <Input
        onChangeText={(text) => setEmail(text)}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
      />
      <ButtonGroup
        selectedButtonStyle={{ backgroundColor: appColors.powderBlue }}
        buttons={buttons}
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
  args.setEmail(null);
  args.setSelectedIndex(-1);
  onFilterDisabled();
}

function onFilterBtnPress(args, onFilterEnabled, buttons) {
  if (args.selectedIndex === -1 && isEmpty(args.email)) {
    Alert.alert("Error", "You must specify something to filter");
    return false;
  }
  const filterObj = {};
  if (args.selectedIndex !== -1) {
    filterObj.role = ["=", `'${buttons[args.selectedIndex]}'`];
  }
  if (!isEmpty(args.email)) {
    filterObj.email = ["=", `'${args.email.toLowerCase()}'`];
  }
  onFilterEnabled(filterObj);
  return true;
}
