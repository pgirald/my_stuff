import { isEmpty } from "lodash";
import React, { useState } from "react";
import { Alert } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Input } from "react-native-elements";
import FilterModal from "./FilterModal";
import DatesInput from "../Inputs/DatesInput";

export default function NameFilterModal({
  modalRef,
  onFilterEnabled,
  onFilterDisabled,
}) {
  const [name, setName] = useState(null);
  return (
    <FilterModal
      modalRef={modalRef}
      onFilterDisabled={() => {
        onFilterDisabledBtnPress({ setName });
        onFilterDisabled();
      }}
      onFilterBtnPress={() => onFilterBtnPress({ name }, onFilterEnabled)}
    >
      <Input
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        value={name}
      />
    </FilterModal>
  );
}

function onFilterDisabledBtnPress(args) {
  args.setName(null);
}

function onFilterBtnPress(args, onFilterEnabled) {
  if (!args.name) {
    Alert.alert("Error", "You must specify a name");
    return false;
  }
  onFilterEnabled({
    name: ["LIKE", `'${args.name}%'`],
    orderFields: [{ name: "name", direction: "DESC" }],
  });
  return true;
}
