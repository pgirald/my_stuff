import { enableExpoCliLogging } from "expo/build/logs/Logs";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../Buttons/AppButton";
import { appColors } from "../Styles/Colors";
import Modal from "./Modal";

export default function FilterModal({
  children,
  modalRef,
  onFilterBtnPress,
  onFilterDisabled,
}) {
  const [filterEnabled, setFilterEnabled] = useState(false);
  return (
    <Modal modalRef={modalRef}>
      {children}
      <View style={{ flexDirection: "row" }}>
        <AppButton
          style={{
            backgroundColor: appColors.flamingo,
            height: 30,
            width: 130,
          }}
          title="Apply filter"
          onPress={() => {
            modalRef.current.show(false);
            setFilterEnabled(onFilterBtnPress() || filterEnabled);
          }}
        />
        <AppButton
          style={{
            backgroundColor: appColors.aquamarineBlue,
            height: 30,
            width: 130,
            marginLeft: 10,
          }}
          title="Disable filter"
          onPress={() => {
            setFilterEnabled(false);
            modalRef.current.show(false);
            onFilterDisabled();
          }}
          disabled={!filterEnabled}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
