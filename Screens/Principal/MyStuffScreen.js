import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Loading from "../../Components/General/Loading";
import { appColors } from "../../Components/Styles/Colors";
import { onStateChagedListener } from "../../Utils/Persistence/Actions";
import LoginScreen from "../Account/Login/LoginScreen";
import MenuScreen from "../Menu/MenuScreen";

export default function MyStuffScreen() {
  const [userLogged, setUserLogged] = useState(null);
  const removeListener = useRef();

  useEffect(() => {
    removeListener.current = onStateChagedListener((user) => {
      if (user) {
        setUserLogged(true);
      } else {
        setUserLogged(false);
      }
    });
  }, []);

  if (userLogged === null) {
    return <Loading backgroundColor={appColors.white} />;
  } else if (removeListener.current) {
    removeListener.current();
    removeListener.current = null;
  }
  return userLogged ? (
    <MenuScreen onUserSingOut={() => setUserLogged(false)} />
  ) : (
    <LoginScreen onUserLogged={() => setUserLogged(true)} />
  );
}

const styles = StyleSheet.create({});
