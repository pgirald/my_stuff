import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "react-native-elements";
import ModalForm from "../../Components/General/ModalForm";
import AppObjectListComponent from "../../Components/General/AppObectList/AppObjectListComponent";
import { isEmpty } from "lodash";
import ParticipantItem from "../../Components/ListItems/ParticipantItem";
import {
  addRequest,
  getCurrentUser,
  getParticipants,
} from "../../Utils/Persistence/Actions";
import { useFocusEffect } from "@react-navigation/native";
import { RoleSelect } from "../../Components/Inputs/RoleSelect";
import { EmailInput } from "../../Components/Inputs/EmailInput";
import { Alert } from "react-native";

export default function ParticipantsList({ navigation, project, role }) {
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ title: "Participants", headerRight: null });
    }, [])
  );

  return (
    <AppObjectListComponent
      ModalForm={(args) => AddRequestForm({ ...args, project: project })}
      addObject={(requestData) => addRequest(requestData)}
      getObjects={(limit) => getParticipants(project.id, limit)}
      getMoreObjects={(limit, startParticipant) =>
        getParticipants(project.id, limit, startParticipant)
      }
      createObject={createRequest}
      renderItem={(participant) => (
        <ParticipantItem
          participant={participant.item}
          onPress={(participant) =>
            navigation.navigate("ParticipantInfo", {
              participant: participant,
              role: role,
              project: project,
            })
          }
        />
      )}
    />
  );
}

function AddRequestForm({ modalRef, onConfirm, project }) {
  const [emailError, setEmailError] = useState(null);
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState("guest");
  return (
    <ModalForm
      modalRef={modalRef}
      btnText="Send request"
      onConfirm={onConfirmBtnPress}
    >
      <EmailInput
        placeholder="User email"
        onChange={({ validatedText }) => setEmail(validatedText)}
        errorMessage={emailError}
      />
      <RoleSelect
        onRoleChanged={(role) => setRole(role)}
        containerStyle={{
          marginBottom: 20,
        }}
      />
    </ModalForm>
  );

  function onConfirmBtnPress() {
    if (isEmpty(email)) {
      setEmailError("You must specify a valid email");
      return;
    }
    onConfirm({ email, project, role });
  }
}

function createRequest(data) {
  return {
    projectId: data.project.id,
    projectName: data.project.name,
    senderEmail: getCurrentUser().email,
    receiverEmail: data.email,
    creationDate: new Date(),
    proposedRole: data.role,
  };
}
