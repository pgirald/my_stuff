import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppIcon } from "../Icons/AppIcon";
import { appColors } from "../Styles/Colors";

export default function FilterButton({ FilterModal }) {
  const [iconName, setIconName] = useState("magnify");
  const modalRef = useRef();
  return (
    <View>
      <AppIcon
        color={appColors.white}
        name="magnify"
        size={50}
        onPress={() => modalRef.current.show(true)}
      />
      <FilterModal
        modalRef={modalRef}
        onFilterDisable={() => setIconName("magnify")}
        onFilterEnabled={() => setIconName("magnify-scan")}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
