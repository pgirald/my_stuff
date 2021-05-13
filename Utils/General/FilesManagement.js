import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";

export const loadImageFromGallery = async (array) => {
  let result = { successful: false, uri: null };
  const resultPermissions = await Permissions.askAsync(Permissions.CAMERA);
  if (resultPermissions.status === "denied") {
    Alert.alert("The app needs you to allow it to access your phone images");
    return result;
  }
  result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: array,
  });
  if (result.cancelled) {
    return result;
  }
  result.successful = true;
  result.uri = result.uri;
  return result;
};

export const loadFileFromExplorer = async () => {
  const result = { successful: false, uri: null, name: null };
  /*const resultPermissions = await Permissions.askAsync(Permissions.)
  if (resultPermissions.status === "denied") {
    Alert.alert("The app needs you to allow it to access your phone documents");
    return result;
  }*/
  const docData = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: false,
    multiple: false,
  });
  if (docData.type === "cancel") {
    return result;
  }
  result.successful = true;
  result.uri = docData.uri;
  result.name = docData.name;
  return result;
};

export const fileToBlob = async (path) => {
  const file = await fetch(path);
  const blob = await file.blob();
  return blob;
};

export const getFileType = (fileName) => {
  const typeRegex = /\.([A-Za-z]+)$/;
  const result = fileName.match(typeRegex);
  return result && result[1];
};

export const openFileInBrowser = async (url) => {
  const result = { successful: false, error: null };
  try {
    const response = await WebBrowser.openBrowserAsync(url);
    if (response.type === "cancel" || response.type !== "opened") {
      result.error = "Operation canceled ";
    } else {
      result.successful = true;
    }
  } catch (error) {
    result.error = error;
  }
  return result;
};
