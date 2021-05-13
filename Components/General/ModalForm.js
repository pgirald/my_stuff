import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../Buttons/AppButton";
import { modalButtonStyle } from "../Buttons/ModalButtonStyle";
import Modal from "./Modal";

export default function ModalForm({ onConfirm, modalRef, children, btnText }) {
  return (
    <Modal modalRef={modalRef}>
      {children}
      <AppButton
        style={modalButtonStyle()}
        title={btnText}
        onPress={onConfirm}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({});
