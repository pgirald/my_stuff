import { isEmpty } from "lodash";
import { Alert } from "react-native";
import {
  deleteActivity,
  updateActivity,
} from "../../../Utils/Persistence/Actions";

export function onDateChanged(args, propName, value, getMilliseconds, dates) {
  onDataChanged(args, propName, value);
  dates.current[propName] = value;
  if (dates.current.startDate && dates.current.finishDate) {
    args.setMilliseconds(getMilliseconds(dates.current));
  }
}

export function onDataChanged(args, propName, value) {
  args.setData({ ...args.data, [propName]: value });
  if (args.nothingChanged) {
    args.setNothingChanged(false);
  }
}

export function onDiscardBtnPress(args, defaultData, dates, getMilliseconds) {
  dates.current.startDate = defaultData.startDate;
  dates.current.finishDate = defaultData.finishDate;
  args.setMilliseconds(getMilliseconds(dates.current));
  args.setData(defaultData);
  args.setKey(!args.key);
  args.setNothingChanged(true);
}

export async function onUpdateBtnPress(
  args,
  acitvity,
  onActivityUpdated,
  defaultData,
  role
) {
  if (role === "guest") {
    if (defaultData.done === args.data.done) {
      Alert.alert(
        "Error",
        "Only an owner or an administrator of this project can change the data of this activity"
      );
      return;
    }
    args.data = { ...defaultData, done: args.data.done };
  }
  const errorMessage = isDataValid(args.data);
  if (errorMessage) {
    Alert.alert("Error", errorMessage);
    return;
  }
  args.setLoading(true);
  const result = await updateActivity(acitvity, args.data, defaultData);
  args.setLoading(false);
  if (result.successful) {
    Alert.alert("Nice!", "The activity was successfully updated");
    onActivityUpdated({ ...acitvity, ...args.data });
    args.setNothingChanged(true);
  } else {
    Alert.alert("Error", "There was an error while updating the activity");
  }
}

export function onDeleteIconPress(args, navigation, activity, role) {
  if (role === "guest") {
    Alert.alert(
      "Error",
      "Only an owner or an administrator of this project can delete this activity"
    );
    return;
  }
  Alert.alert(
    "Wait!",
    "You are about delete the activity, do you want to proceed?",
    [
      { text: "Yes", onPress: () => onYesBtnPress(args, navigation, activity) },
      { text: "No", style: "cancel" },
    ]
  );
}

function isDataValid(data) {
  if (data.startDate && data.finishDate && data.startDate >= data.finishDate) {
    return "The finish date must be greater than the start date";
  }
  if (isEmpty(data.name)) {
    return "The activity must have a name";
  }
}

async function onYesBtnPress(args, navigation, activity) {
  args.setLoading(true);
  const result = await deleteActivity(activity);
  args.setLoading(false);
  if (result.successful) {
    Alert.alert("Nice!", "The project was successfully deleted");
    navigation.goBack();
  } else {
    Alert.alert("Error", "There was an error while deleting the project");
  }
}
