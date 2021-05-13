import {
  areLocationServicesEnabled,
  askForLocationPermission,
  getAdress,
  getCurrentLocation,
} from "../../../Utils/General/Location";
import { Alert } from "react-native";
import { isEmpty } from "lodash";

export async function onFirstRender(args, navigation, defaultRegion) {
  if (defaultRegion) {
    return;
  }
  args.setLoadingText("Checking if services are enabled");
  args.setLoading(true);
  if (!(await areLocationServicesEnabled())) {
    args.setLoading(false);
    Alert.alert("Error", "You need to enable location services");
    navigation.goBack();
    return;
  }
  if (!(await askForLocationPermission())) {
    args.setLoading(false);
    Alert.alert("Error", "The app needs you to give permissions");
    navigation.goBack();
    return;
  }
  args.setLoadingText("Getting current location");
  const result = await getCurrentLocation();
  args.setLoading(false);
  if (result.successful) {
    args.setRegion(result.location);
  } else {
    Alert.alert(
      "Error",
      "There was an error while getting the current location"
    );
  }
}

export async function onMapsIconPress(args) {
  args.setLoadingText("Getting adress");
  args.setLoading(true);
  const result = await getAdress(args.region);
  args.setLoading(false);
  if (result.successful) {
    args.setAdress(result.adress);
  } else {
    Alert.alert("Error", "An error ocurred while getting the adress");
  }
}

export function onConfirmBtnPress(
  args,
  onAdressSpecified,
  defaultAdress,
  defaultRegion
) {
  if (isEmpty(args.adress)) {
    Alert.alert("Error", "You must specify an adress");
    return;
  }
  if (args.adress === defaultAdress) {
    Alert.alert(
      "Error",
      "The adress you specified is equal to the initial one"
    );
    return;
  }
  if (
    defaultRegion &&
    args.region.latitude === defaultRegion.latitude &&
    args.region.longitude === defaultRegion.longitude
  ) {
    Alert.alert(
      "Error",
      "The adress you specified is equal to the initial one"
    );
    return;
  }
  onAdressSpecified(args.region, args.adress);
}
