import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

export const askForLocationPermission = async () => {
  const resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
  if (resultPermissions.status === "denied") {
    Alert.alert(
      "Error",
      "The app needs you to allow it to access your phone location"
    );
    return false;
  }
  return true;
};

export const getCurrentLocation = async () => {
  const result = { successful: true, location: null };
  try {
    const position = await Location.getCurrentPositionAsync();
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };
    result.location = location;
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const getAdress = async (region) => {
  const result = { successful: true, error: null, adress: null };
  try {
    const adressInfo = await Location.reverseGeocodeAsync(region);
    result.adress =
      (adressInfo[0].street || "") +
      " " +
      (adressInfo[0].name || "") +
      " " +
      (adressInfo[0].postalCode || "") +
      " " +
      (adressInfo[0].city || "");
  } catch (error) {
    result.successful = false;
    result.error = error;
  }
  return result;
};

export const areLocationServicesEnabled = async () => {
  return await Location.hasServicesEnabledAsync();
};
