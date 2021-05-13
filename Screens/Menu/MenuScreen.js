import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { Dimensions } from "react-native";
import { StatusBar } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppButton } from "../../Components/Buttons/AppButton";
import { AppContainer } from "../../Components/Containers/AppContainer";
import { AppView } from "../../Components/Containers/AppView";
import { AppIcon } from "../../Components/Icons/AppIcon";
import { Logo } from "../../Components/Icons/Logo";
import { appColors } from "../../Components/Styles/Colors";
import { getCurrentUser } from "../../Utils/Persistence/Actions";

export default function MenuScreen({ onUserSingOut }) {
  const screenWidth = Dimensions.get("screen").width - 20;
  const ref = 3315;
  const styles = getStyles(screenWidth, ref);
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const user = getCurrentUser();
      if (!user) {
        onUserSingOut();
        return;
      }
      const namesRegex = /^([A-Za-z ]+)@([A-Za-z ]+)$/;
      const names = user.displayName && user.displayName.match(namesRegex);
      navigation.setOptions({
        headerShown: true,
        title: "Welcome " + (names ? names[1] + " " + names[2] : ""),
      });
    }, [])
  );

  return (
    <AppContainer style={{ justifyContent: "flex-start" }}>
      <AppView style={{ marginBottom: 50 }}>
        <Logo source={require("../../assets/logo.png")} style={styles.logo} />
        <AppView style={{ flexDirection: "row" }}>
          <AppButton
            style={styles.statisticsBtn}
            icon={
              <AppIcon
                name="poll"
                color={appColors.white}
                size={screenWidth * 0.3}
              />
            }
          />
          <AppButton
            style={styles.accountBtn}
            onPress={() => navigation.navigate("Account")}
            icon={
              <AppIcon
                name="account"
                color={appColors.white}
                size={screenWidth * 0.26}
              />
            }
          />
        </AppView>
        <AppView style={{ flexDirection: "row" }}>
          <AppButton
            style={styles.requestsBtn}
            onPress={() => navigation.navigate("Requests")}
            icon={
              <AppIcon
                name="account-multiple-plus"
                color={appColors.white}
                size={screenWidth * 0.28}
              />
            }
          />
          <AppButton
            style={styles.projectsBtn}
            onPress={() => navigation.navigate("Projects")}
            icon={
              <AppIcon
                name="chart-timeline-variant"
                color={appColors.white}
                size={screenWidth * 0.43}
              />
            }
          />
        </AppView>
      </AppView>
    </AppContainer>
  );
}

const getStyles = (size, ref) => {
  return StyleSheet.create({
    logo: { height: size * 0.5, width: size * 0.6 },
    statisticsBtn: {
      height: size * 0.43,
      width: size * 0.43,
      borderRadius: 180,
      marginLeft: 20,
      backgroundColor: appColors.bermuda,
    },
    accountBtn: {
      height: size * 0.38,
      width: size * 0.38,
      borderRadius: 180,
      marginLeft: 10,
      backgroundColor: appColors.flamingo,
    },
    requestsBtn: {
      height: size * 0.38,
      width: size * 0.38,
      borderRadius: 180,
      backgroundColor: appColors.shakespeare,
    },
    projectsBtn: {
      height: size * 0.5,
      width: size * 0.5,
      borderRadius: 180,
      marginLeft: 10,
      backgroundColor: appColors.jumbo,
    },
  });
};
