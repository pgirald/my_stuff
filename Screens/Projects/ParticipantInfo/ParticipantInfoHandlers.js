import { Alert } from "react-native";
import {
  ejectParticipant,
  getCurrentUser,
  updateParticipantRole,
} from "../../../Utils/Persistence/Actions";

export function onParticipantRoleChanged(args, participant, newRole, role) {
  if (role !== "owner") {
    Alert.alert(
      "Error",
      "Only the owner of this project can change a participant role"
    );
    args.setKey(!args.key);
    return;
  }
  Alert.alert(
    "Wait!",
    "You are about change the participant role, do you want to proceed?",
    [
      {
        text: "Yes",
        onPress: () => onUpdateConfirm(args, participant, newRole),
      },
      {
        text: "No",
        onPress: () => {
          args.setKey(!args.key);
        },
        style: "cancel",
      },
    ]
  );
}

async function onUpdateConfirm(args, participant, newRole) {
  args.setLoading(true);
  const result = await updateParticipantRole(
    participant.projectId,
    participant,
    newRole
  );
  args.setLoading(false);

  if (result.successful) {
    Alert.alert("Nice!", "The participant role was successfully updated");
  } else {
    Alert.alert(
      "Error",
      "There was an error while updating the participant role"
    );
    args.setKey(!args.key);
  }
}

export function onDeleteIconPress(args, participant, navigation, role) {
  if (participant.role === "owner") {
    Alert.alert("Error", "The project owner cannot be deleted");
    return;
  }
  if (role !== "owner" && participant.email !== getCurrentUser().email) {
    Alert.alert("Error", "Only the project owner can eject a participant");
    return;
  }
  Alert.alert(
    "Wait!",
    "You are about delete the participant, do you want to proceed?",
    [
      {
        text: "Yes",
        onPress: () => onDeleteConfirm(args, participant, navigation),
      },
      { text: "No", style: "cancel" },
    ]
  );
}

async function onDeleteConfirm(args, participant, navigation) {
  args.setLoading(true);
  const result = await ejectParticipant(participant.projectId, participant);
  args.setLoading(false);
  if (result.successful) {
    Alert.alert("Nice!", "The participant role was successfully deleted");
    if (participant.email !== getCurrentUser().email) {
      navigation.goBack();
    } else {
      navigation.pop(2);
    }
  } else {
    Alert.alert("Error", "There was an error while removing the participant");
  }
}
