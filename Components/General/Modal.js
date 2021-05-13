import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";
import { AppButton } from "../Buttons/AppButton";
import { appColors } from "../Styles/Colors";

export default function Modal({ height, children, modalRef, width = "90%" }) {
  useEffect(() => {
    modalRef.current = { show: setVisible };
  }, []);
  const [visible, setVisible] = useState(false);
  return (
    <Overlay
      isVisible={visible}
      overlayStyle={{ height: height, width: width }}
      onBackdropPress={() => setVisible(false)}
    >
      <AppButton
        title="X"
        style={styles.closeBtn}
        onPress={() => setVisible(false)}
      />
      {children}
    </Overlay>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    backgroundColor: appColors.bittersweet,
    height: 25,
    width: 25,
    marginHorizontal: 5,
    alignSelf: "flex-end",
  },
});
