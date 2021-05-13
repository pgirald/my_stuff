import { isEmpty } from "lodash";
import { Alert } from "react-native";
import { deleteTask, updateTask } from "../../../Utils/Persistence/Actions";

export function onDataChanged(args, inputName, value) {
  args.setData({ ...args.data, [inputName]: value });
  if (args.nothingChanged) {
    args.setNothingChanged(false);
  }
}

export function onDiscardBtnPress(args, defaultData) {
  args.setData(defaultData);
  args.setKey(!args.key);
  args.setNothingChanged(true);
}

export async function onUpdateBtnPress(args, task, defaultData, role) {
  if (role === "guest") {
    if (defaultData.done === args.data.done) {
      Alert.alert(
        "Error",
        "Only an owner or administrator of this project can change the data of this task"
      );
      return;
    }
    args.data = { ...defaultData, done: args.data.done };
  }
  if (isEmpty(args.data.name)) {
    Alert.alert("Error", "The task must have a name");
    return;
  }
  args.setLoading(true);
  const result = await updateTask(task, args.data, defaultData);
  args.setLoading(false);
  if (result.successful) {
    Alert.alert("Nice!", "The task was successfully updated");
    args.setNothingChanged(true);
    args.setDefaultData(args.data);
  } else {
    Alert.alert("Error", "There was an error while updating the task");
  }
}

export function onDeleteIconPress(args, task, navigation, role) {
  if (role === "guest") {
    Alert.alert(
      "Error",
      "Only an owner or administrator of this project can delete this task"
    );
    return;
  }
  Alert.alert(
    "Wait!",
    "You are about delte the task. Do you want to proceed?",
    [
      { text: "Yes", onPress: () => onYesBtnPress(args, task, navigation) },
      { text: "No", style: "cancel" },
    ]
  );
}

async function onYesBtnPress(args, task, navigation) {
  args.setLoading(true);
  const result = await deleteTask(task);
  args.setLoading(false);
  if (result.successful) {
    Alert.alert("Nice!", "The task was successfully deleted");
    navigation.goBack();
  } else {
    Alert.alert("Error", "There was an error while deleting the task");
  }
}
