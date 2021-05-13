import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { StyleSheet, Text, View } from "react-native";
import { AppView } from "../Containers/AppView";
import { appColors } from "../Styles/Colors";

export default function AppTimer({ initialMilliseconds }) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        realMilliSeconds.current.real <= 0 &&
        realMilliSeconds.current.real !== 0
      ) {
        setMilliseconds(0);
        return;
      }
      realMilliSeconds.current.real -= 1000;
      setMilliseconds(realMilliSeconds.current.real);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [milliseconds, setMilliseconds] = useState(initialMilliseconds);

  const realMilliSeconds = useRef({
    ini: initialMilliseconds,
    real: initialMilliseconds,
  });
  if (realMilliSeconds.current.ini !== initialMilliseconds) {
    realMilliSeconds.current.ini = initialMilliseconds;
    realMilliSeconds.current.real = initialMilliseconds;
  }

  return <TimerDisplay milliseconds={milliseconds} />;
}

function TimerDisplay({ milliseconds }) {
  const [days, hours, minutes, seconds] = getLabelsValues(milliseconds);
  return (
    <AppView style={styles.wraper}>
      <AppView style={styles.container}>
        <AppView>
          <Text style={styles.numbers}>{days}</Text>
          <Text style={styles.labels}>days</Text>
        </AppView>
        <Text style={styles.numbers}>:</Text>
        <AppView>
          <Text style={styles.numbers}>{hours}</Text>
          <Text style={styles.labels}>hrs</Text>
        </AppView>
        <Text style={styles.numbers}>:</Text>
        <AppView>
          <Text style={styles.numbers}>{minutes}</Text>
          <Text style={styles.labels}>min</Text>
        </AppView>
        <Text style={styles.numbers}>:</Text>
        <AppView>
          <Text style={styles.numbers}>{seconds}</Text>
          <Text style={styles.labels}>sec</Text>
        </AppView>
      </AppView>
      <Text style={styles.timeLeft}>Time left</Text>
    </AppView>
  );
}

const getLabelsValues = (milliseconds) => {
  const days = milliseconds / (3600 * 24 * 1000);
  const hours = (days % 1) * 24;
  const minutes = (hours % 1) * 60;
  const seconds = (minutes % 1) * 60;
  return [format(days), format(hours), format(minutes), format(seconds)];
};

const format = (number) => {
  if (number / 100 > 1) {
    return "99";
  }
  if (number / 10 < 1) {
    return "0" + String(Math.trunc(number));
  }
  return Math.trunc(number);
};

const styles = StyleSheet.create({
  wraper: {
    borderWidth: 1,
    borderColor: appColors.regentGray,
  },
  container: {
    flexDirection: "row",
    backgroundColor: appColors.aquamarineBlue,
  },
  numbers: { fontSize: 50, color: appColors.white },
  labels: { fontSize: 20, color: appColors.white, textAlign: "center" },
  timeLeft: { fontSize: 25, color: appColors.jumbo, textAlign: "center" },
});
