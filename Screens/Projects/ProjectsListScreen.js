import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input, ListItem } from "react-native-elements";
import ModalForm from "../../Components/General/ModalForm";
import AppObjectListComponent from "../../Components/General/AppObectList/AppObjectListComponent";
import { isEmpty } from "lodash";
import {
  addProject,
  getCurrentUser,
  getProjects,
} from "../../Utils/Persistence/Actions";
import ProjectItem from "../../Components/ListItems/ProjectItem";
import { useNavigation } from "@react-navigation/native";

export default function ProjectsListScreen() {
  const navigation = useNavigation();
  return (
    <AppObjectListComponent
      ModalForm={AddProjectForm}
      addObject={addProject}
      getObjects={(limit) => getProjects(getCurrentUser().uid, limit)}
      getMoreObjects={(limit, startProject) =>
        getProjects(getCurrentUser().uid, limit, startProject)
      }
      createObject={createProject}
      renderItem={(data) => (
        <ProjectItem
          project={data.item.project}
          role={data.item.role}
          onPress={(project, role) =>
            navigation.navigate("ProjectTabNavigator", {
              role,
              project,
            })
          }
        />
      )}
    />
  );
}

function AddProjectForm({ modalRef, onConfirm }) {
  const [projectNameError, setProjectNameError] = useState(null);
  const [name, setName] = useState(null);
  return (
    <ModalForm
      modalRef={modalRef}
      btnText="Add project"
      onConfirm={onConfirmBtnPress}
    >
      <Input
        placeholder="Project name"
        onChangeText={(text) => setName(text)}
        errorMessage={projectNameError}
      />
    </ModalForm>
  );

  function onConfirmBtnPress() {
    if (isEmpty(name)) {
      setProjectNameError("You must specify a valid name for the project");
      return;
    }
    onConfirm({ name: name });
  }
}

function createProject(projectData) {
  return {
    name: projectData.name,
    startDate: null,
    finishDate: null,
    creationDate: new Date(),
    owner: getCurrentUser().uid,
    completionDate: null,
    done: false,
    activitiesCount: 0,
    doneActivitiesCount: 0,
  };
}
