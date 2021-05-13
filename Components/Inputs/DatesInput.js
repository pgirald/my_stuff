import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppView } from "../Containers/AppView";
import Modal from "../General/Modal";
import { appColors } from "../Styles/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DatesInput({
  containerStyle,
  initialStartDate,
  initialFinishDate,
  onStartDateChanged = () => {},
  onFinishDateChanged = () => {},
}) {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showFinishDatePicker, setShowFinishDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [finishDate, setFinishDate] = useState(initialFinishDate);
  return (
    <AppView style={containerStyle}>
      <AppView style={styles.datesContainer}>
        <AppView>
          <Text
            style={{
              ...styles.dates,
              borderBottomWidth: 1,
              borderBottomColor: appColors.regentGray,
            }}
          >
            Start date
          </Text>
          <Text style={styles.datesLabel}>Finish date</Text>
        </AppView>
        <AppView>
          <Text
            style={{
              ...styles.datesLabel,
              borderBottomWidth: 1,
              borderBottomColor: appColors.regentGray,
              borderLeftWidth: 1,
              borderLeftColor: appColors.regentGray,
            }}
            onPress={() => setShowStartDatePicker(true)}
          >
            {startDate
              ? startDate.getDate() +
                "/" +
                (startDate.getMonth() + 1) +
                "/" +
                startDate.getFullYear()
              : "--/--/----"}
          </Text>
          <Text
            style={{
              ...styles.dates,
              borderLeftWidth: 1,
              borderLeftColor: appColors.regentGray,
            }}
            onPress={() => setShowFinishDatePicker(true)}
          >
            {finishDate
              ? finishDate.getDate() +
                "/" +
                (finishDate.getMonth() + 1) +
                "/" +
                finishDate.getFullYear()
              : "--/--/----"}
          </Text>
        </AppView>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate || new Date()}
            onChange={(e, date) => {
              setShowStartDatePicker(false);
              if (date) {
                setStartDate(date);
                onStartDateChanged(date);
              }
            }}
          />
        )}
        {showFinishDatePicker && (
          <DateTimePicker
            value={finishDate || new Date()}
            onChange={(e, date) => {
              setShowFinishDatePicker(false);
              if (date) {
                setFinishDate(date);
                onFinishDateChanged(date);
              }
            }}
          />
        )}
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  dates: {
    textAlign: "center",
    fontSize: 25,
    color: appColors.grayChateaua,
    width: 140,
  },
  datesLabel: {
    textAlign: "center",
    fontSize: 25,
    color: appColors.white,
    backgroundColor: appColors.robbinsEggBlue,
    width: 140,
  },
  datesContainer: {
    flexDirection: "row",
    borderColor: appColors.regentGray,
    borderWidth: 1,
  },
});
