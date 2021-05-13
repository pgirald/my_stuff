import { isEmpty } from "lodash";
import { Alert } from "react-native";
import {
  deleteProject,
  updateProject,
} from "../../../Utils/Persistence/Actions";

export function onDataChanged(args, propName, value) {
  args.setData({ ...args.data, [propName]: value });
  if (args.nothingChanged) {
    args.setNothingChanged(false);
  }
}

export function onDiscardBtnPress(args, project) {
  args.setData({
    name: project.name,
    owner: project.owner,
    startDate: project.startDate,
    finishDate: project.finishDate,
  });
  args.setKey(!args.key);
  args.setNothingChanged(true);
}

export async function onUpdateBtnPress(args, project, onProjectUpdated, role) {
  if (role === "guest") {
    Alert.alert(
      "Error",
      "Only the owner or an administrator of this project can update it"
    );
    return;
  }
  const errorMessage = isDataValid(args.data);
  if (errorMessage) {
    Alert.alert("Error", errorMessage);
    return;
  }
  args.setLoading(true);
  const result = await updateProject(project.id, args.data);
  args.setLoading(false);
  if (result.successful) {
    Alert.alert("Nice!", "The project was successfully updated");
    onProjectUpdated({ ...project, ...args.data });
    args.setNothingChanged(true);
  } else {
    Alert.alert("Error", "There was an error while updating the project");
  }
}

export function onDeleteIconPress(args, navigation, project, role) {
  if (role !== "owner") {
    Alert.alert("Error", "Only the owner of this project can delete it");
    return;
  }
  Alert.alert(
    "Wait!",
    "You are about delete the project, do you want to proceed?",
    [
      { text: "Yes", onPress: () => onYesBtnPress(args, navigation, project) },
      { text: "No", style: "cancel" },
    ]
  );
}

function isDataValid(data) {
  if (data.startDate && data.finishDate && data.startDate >= data.finishDate) {
    return "The finish date must be greater than the start date";
  }
  if (isEmpty(data.name)) {
    return "The project must have a name";
  }
  if (isEmpty(data.owner)) {
    return "The project must have an owner";
  }
}

export async function onYesBtnPress(args, navigation, project) {
  args.setLoading(true);
  const result = await deleteProject(project.id);
  args.setLoading(false);
  if (result.successful) {
    Alert.alert("Nice!", "The project was successfully deleted");
    navigation.goBack();
  } else {
    Alert.alert("Error", "There was an error while deleting the project");
  }
}
