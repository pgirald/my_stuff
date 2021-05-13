import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Icon, Image, Input } from "react-native-elements";
import CountryPicker from "react-native-country-picker-modal";
import { isPhoneNumberValid } from "../../Utils/General/InputValidations";

export const PhoneInput = ({
  rightIcon,
  errorMessage,
  defaultValue = {},
  placeholder = "Phone number",
  onChange = () => {},
  style = {},
  validate = false,
}) => {
  const [country, setCountry] = useState("CO");
  const [callingCode, setCallingCode] = useState(
    defaultValue.callingCode || "57"
  );
  const [phoneNumber, setPhoneNumber] = useState(
    defaultValue.phoneNumber || ""
  );
  return (
    <View style={{ ...style, width: style.width || "100%" }}>
      <CountryPicker
        withFlag
        withCallingCode
        withFilter
        withCallingCodeButton
        containerButtonStyle={styles.countryPicker}
        countryCode={country}
        onSelect={(country) => {
          setCountry(country.cca2);
          setCallingCode(country.callingCode[0]);
          onChange({
            phone: isEmpty(phoneNumber)
              ? undefined
              : { callingCode: country.callingCode[0], number: phoneNumber },
          });
        }}
      />
      <Input
        value={phoneNumber}
        placeholder={placeholder}
        errorMessage={
          validate
            ? errorMessage ||
              (isEmpty(phoneNumber) && "You must specify a phone number")
            : undefined
        }
        onChangeText={(e) => {
          let phoneNumberAux = phoneNumber;
          if (isPhoneNumberValid(e)) {
            setPhoneNumber(e);
            phoneNumberAux = e;
          }
          onChange({
            phone: isEmpty(phoneNumberAux)
              ? undefined
              : { callingCode, number: phoneNumberAux },
          });
        }}
        keyboardType="phone-pad"
        rightIcon={rightIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  countryPicker: { marginLeft: 8 },
});
