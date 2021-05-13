import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { AppView } from "../Containers/AppView";
import { appColors } from "../Styles/Colors";

export function RoleSelect({
  onRoleChanged,
  defaultRole,
  containerStyle = {},
}) {
  defaultRole === "admin" || defaultRole === "guest" || (defaultRole = "guest");
  const [guestBtnColor, setGuestBtnColor] = useState(
    defaultRole === "guest" ? appColors.flamingo : appColors.silver
  );
  const [adminBtnColor, setAdminBtnColor] = useState(
    defaultRole === "admin" ? appColors.flamingo : appColors.silver
  );
  const btnsStyle = {
    height: 30,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  };
  const textStyle = { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" };
  return (
    <AppView style={{ ...containerStyle, flexDirection: "row" }}>
      <TouchableOpacity
        style={{
          backgroundColor: guestBtnColor,
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          ...btnsStyle,
        }}
        onPress={() => {
          if (guestBtnColor === appColors.flamingo) {
            return;
          }
          setAdminBtnColor(appColors.silver);
          setGuestBtnColor(appColors.flamingo);
          onRoleChanged("guest");
        }}
      >
        <Text style={textStyle}>Guest</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: adminBtnColor,
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          ...btnsStyle,
        }}
        onPress={() => {
          if (adminBtnColor === appColors.flamingo) {
            return;
          }
          setAdminBtnColor(appColors.flamingo);
          setGuestBtnColor(appColors.silver);
          onRoleChanged("admin");
        }}
      >
        <Text style={textStyle}>Admin</Text>
      </TouchableOpacity>
    </AppView>
  );
}
