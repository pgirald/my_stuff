import { Alert } from "react-native";
import { updateActivity } from "../../../Utils/Persistence/Actions";

export async function onAdressSpecified(
  setLoading,
  region,
  adress,
  activity,
  onActivityUpdated
) {
  setLoading(true);
  const result = await updateActivity(
    activity,
    { adress: adress, location: region },
    activity
  );
  setLoading(false);
  if (result.successful) {
    Alert.alert("Nice!", "Adress updated successfully");
    onActivityUpdated({ ...activity, adress: adress, location: region });
  } else {
    Alert.alert("Error", "There was an error while updating the adress");
  }
}
