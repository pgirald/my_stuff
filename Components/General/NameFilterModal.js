import { isEmpty } from "lodash";
import React, { useState } from "react";
import { Alert } from "react-native";
import { Input } from "react-native-elements";
import FilterModal from "./FilterModal";

export default function NameFilterModal({
  modalRef,
  onFilterEnabled,
  onFilterDisabled,
  fieldName = "name",
}) {
  const [name, setName] = useState(null);
  return (
    <FilterModal
      modalRef={modalRef}
      onFilterDisabled={() => {
        onFilterDisabledBtnPress({ setName });
        onFilterDisabled();
      }}
      onFilterBtnPress={() =>
        onFilterBtnPress({ name }, onFilterEnabled, fieldName)
      }
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

function onFilterBtnPress(args, onFilterEnabled, fieldName) {
  if (!args.name) {
    Alert.alert("Error", "You must specify a name");
    return false;
  }
  onFilterEnabled({ [fieldName]: ["=", `'${args.name}'`] });
  return true;
}
