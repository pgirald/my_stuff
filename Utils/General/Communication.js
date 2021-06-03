import { size } from "lodash";
import { Alert, Linking } from "react-native";

export const callNumber = (phoneNumber) => {
  Linking.openURL(`tel:${phoneNumber}`);
};

export const sendWhatsApp = (phoneNumber, text = "") => {
  const link = `https://wa.me/${phoneNumber}?text=${text}`;
  Linking.canOpenURL(link).then((supported) => {
    if (!supported) {
      Alert.alert("Install whatsapp to send a message");
      return;
    }
    return Linking.openURL(link);
  });
};

export const sendEmail = (to, subject, body = "") => {
  Linking.openURL(`mailto:${to}?subject=${subject}&body=${body}`);
};
