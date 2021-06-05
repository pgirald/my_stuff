import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import MainSreen from "./Screens/Principal/MainSreen";
import { startNotifications } from "./Utils/General/Communication";

export default function App() {
  return (
    <NavigationContainer>
      <MainSreen />
    </NavigationContainer>
  );
}
