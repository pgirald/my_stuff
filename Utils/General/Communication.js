import { size } from "lodash";
import { Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

export const getPermissionsForNotifications = async () => {
  if (!Constants.isDevice) {
    return {
      successful: false,
      error: "You must use a real device to use this functionality",
    };
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return {
      successful: false,
      error: "You must give permissions to send notifications to proceed",
    };
  }
  return { successful: true };
};

export const getToken = async () => {
  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS == "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

export const startNotifications = (notificationListener, responseListener) => {
  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log(notification);
    }
  );
  responseListener.current =
    Notifications.addNotificationResponseReceivedListener((notification) => {
      console.log(notification);
    });
  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

export const sendPushNotification = async (message) => {
  let response = false;
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  }).then(() => (response = true));
  return response;
};

export const generateNotificationMessage = (token, title, body, data) => {
  const message = {
    to: token,
    sound: "default",
    title: title,
    body: body,
    data: data,
  };
  return message;
};
